import { expectedScore } from "../src/elo-engine";
import { EloRankingBoardInMemory } from "../src/index";
import { Player } from "../src/types";

describe("elo-board (in memory)", () => {
    // /!\ shared board instance, the order of tests is important
    const initialRank = 1000;
    const kFactorRule = () => 32;
    const eloBoard = new EloRankingBoardInMemory(initialRank, kFactorRule);
    const createPlayerSpy = jest.spyOn(eloBoard, 'createPlayer');
    const createMatchSpy = jest.spyOn(eloBoard, 'createMatch');

    describe("GETTER/SETTERS", () => {
        it(`should return correct getter property initialRank`, () => {
            expect(eloBoard.initialRank).toBeCloseTo(initialRank);
        });
        it(`should return correct getter property kFactorRule`, () => {
            expect(eloBoard.kFactorRule).toBe(kFactorRule);
        });
        it(`should update correct setter property initialRank`, () => {
            const monotestEloBoard = new EloRankingBoardInMemory(1000, () => 32);
            monotestEloBoard.initialRank = 1500;
            expect(monotestEloBoard.initialRank).toBeCloseTo(1500);
        });
        it(`should update correct setter property kFactorRule`, () => {
            const monotestKFactorRule = () => 666;
            const monotestEloBoard = new EloRankingBoardInMemory(1000, () => 32);
            monotestEloBoard.kFactorRule = monotestKFactorRule;
            expect(monotestEloBoard.kFactorRule).toBe(monotestKFactorRule);
        });
    });

    describe("createPlayer", () => {
        it(`should return newly created player (from scratch)`, () => {
            const newScratchPlayerA = eloBoard.createPlayer();
            const newScratchPlayerB = eloBoard.createPlayer();

            expect(newScratchPlayerA).toHaveProperty('id');
            expect(newScratchPlayerA).toHaveProperty('matches');
            expect(newScratchPlayerA.id).not.toBe(newScratchPlayerB.id);
            expect(newScratchPlayerA.matches).toBeInstanceOf(Array);
            expect(newScratchPlayerA.matches.length).toBe(0);
            expect(newScratchPlayerA.initialRank).toBe(eloBoard.initialRank);
            expect(newScratchPlayerA.currentRank).toBe(eloBoard.initialRank);
        });

        it(`should return newly created player (from parameters)`, () => {
            const fullPlayer = { creationDate: 375663602, lastPlayed: 943657202, initialRank: 666, currentRank: 111, matches: [0, 1, 2, 3, 4] };
            const partialPlayer = { currentRank: 222, matches: [5, 6] };
            const newFullPlayer = eloBoard.createPlayer(fullPlayer);
            const newPartialPlayer = eloBoard.createPlayer(partialPlayer);

            expect(newFullPlayer).toHaveProperty('id');
            expect(newPartialPlayer).toHaveProperty('id');
            expect(newFullPlayer.creationDate).toBe(fullPlayer.creationDate);
            expect(newFullPlayer.lastPlayed).toBe(fullPlayer.lastPlayed);
            expect(newFullPlayer.initialRank).toBe(fullPlayer.initialRank);
            expect(newFullPlayer.currentRank).toBe(fullPlayer.currentRank);
            expect(newFullPlayer.matches).toBe(fullPlayer.matches);
            expect(newPartialPlayer.initialRank).toBe(eloBoard.initialRank);
            expect(newPartialPlayer.currentRank).toBe(partialPlayer.currentRank);
        });

        it(`should overwrite given id with system provided id`, () => {
            const fullPlayerWithId = { id: 1492, creationDate: 375663602, lastPlayed: 943657202, initialRank: 666, currentRank: 111, matches: [0, 1, 2, 3, 4] };
            const newFullPlayerWithId = eloBoard.createPlayer(fullPlayerWithId);

            expect(newFullPlayerWithId.id).not.toBe(fullPlayerWithId.id);
        });
    });

    describe("getPlayer", () => {
        it(`should return the correct player from the list`, () => {
            const newlyCreatedPlayer = eloBoard.createPlayer();
            const foundCreatedPlayer = eloBoard.getPlayer(newlyCreatedPlayer.id);

            expect(foundCreatedPlayer).toEqual(newlyCreatedPlayer); // is clone
            expect(foundCreatedPlayer).not.toBe(newlyCreatedPlayer); // is not identity object (prevent player data tempering)
            expect(foundCreatedPlayer).not.toBeNull();
        });

        it(`should return null if player id do not exist`, () => {
            const nonExistentPlayer = eloBoard.getPlayer(1492);

            expect(nonExistentPlayer).toBeNull();
        });
    });

    describe("getAllPlayers", () => {
        it(`should return the full list of players registered`, () => {
            const playersRoster = eloBoard.getAllPlayers();

            expect(playersRoster).toBeInstanceOf(Array);
            expect(playersRoster.length).toBeGreaterThan(0);
            expect(playersRoster.length).toBe(createPlayerSpy.mock.calls.length); // players roster size should match how many times createPlayer has been called
        });
    });

    describe("deletePlayer", () => {
        it(`should remove player from player roster`, () => {
            const targetedPlayer = eloBoard.getPlayer(3);
            const playersRoster = eloBoard.getAllPlayers();
            eloBoard.deletePlayer(3);

            expect(targetedPlayer).not.toBeNull();
            expect(eloBoard.getPlayer(3)).toBeNull();
            expect(eloBoard.getAllPlayers().length).toBe(playersRoster.length - 1);
        });
    });

    describe("createMatch", () => {
        it(`should return a valid match instance`, () => {
            const matchParams = { playerAId:0, playerBId:1, matchOutcome: 1 };
            const createdMatch = eloBoard.createMatch((matchParams as any));

            expect(createdMatch).toHaveProperty('playerAId', 0);
            expect(createdMatch).toHaveProperty('playerBId', 1);
            expect(createdMatch).toHaveProperty('playerAKFactor', 32);
            expect(createdMatch).toHaveProperty('playerBKFactor', 32);
            expect(createdMatch).toHaveProperty('matchOutcome', 1);
            expect(createdMatch).toHaveProperty('id');
            expect(createdMatch).toHaveProperty('creationDate');
            expect(createdMatch).toHaveProperty('resolutionDate');
            expect(createdMatch).toHaveProperty('playerARank');
            expect(createdMatch).toHaveProperty('playerBRank');
            expect(createdMatch.creationDate).toEqual(expect.any(Number));
            expect(createdMatch.creationDate).toEqual(expect.any(Number));
            expect(createdMatch.playerARank).toEqual(expect.any(Number));
            expect(createdMatch.playerBRank).toEqual(expect.any(Number));
        });

        it(`should update players current ranks et played matches`, () => {
            const matchParams = { playerAId:0, playerBId:1, matchOutcome: 1 };
            const preMatchPlayerA = eloBoard.getPlayer(matchParams.playerAId);
            const preMatchPlayerB = eloBoard.getPlayer(matchParams.playerBId);

            const createdMatch = eloBoard.createMatch((matchParams as any));

            const postMatchPlayerA = eloBoard.getPlayer(matchParams.playerAId);
            const postMatchPlayerB = eloBoard.getPlayer(matchParams.playerBId);

            // match is registered
            expect(postMatchPlayerA?.matches).toEqual([...(preMatchPlayerA?.matches as number[]), createdMatch.id]);
            expect(postMatchPlayerB?.matches).toEqual([...(preMatchPlayerB?.matches as number[]), createdMatch.id]);

            // players rank is updated
            const playerAScoreDiff = (postMatchPlayerA?.currentRank as number) - (preMatchPlayerA?.currentRank as number);
            expect(postMatchPlayerB?.currentRank).toBe((preMatchPlayerB?.currentRank as number) - playerAScoreDiff);

            // last played is updated
            expect(postMatchPlayerA?.lastPlayed).toBeGreaterThan((preMatchPlayerA?.lastPlayed as number));
            expect(postMatchPlayerB?.lastPlayed).toBeGreaterThan((preMatchPlayerB?.lastPlayed as number));
        });

        it(`should throw if both players are identical`, () => {
            const samePlayersMatchParams = { playerAId:1, playerBId:1, matchOutcome: 1 };

            expect(() => {
                eloBoard.createMatch((samePlayersMatchParams as any));
            }).toThrow();
        });

        it(`should throw if one or both players are non existent`, () => {
            const playerAUnknownMatchParams = { playerAId:6500, playerBId:1, matchOutcome: 1 };
            const playerBUnknownMatchParams = { playerAId:0, playerBId:6500, matchOutcome: 1 };
            const bothPlayerUnknownMatchParams = { playerAId:6500, playerBId:6501, matchOutcome: 1 };

            expect(() => {
                eloBoard.createMatch((playerAUnknownMatchParams as any));
            }).toThrow();
            expect(() => {
                eloBoard.createMatch((playerBUnknownMatchParams as any));
            }).toThrow();
            expect(() => {
                eloBoard.createMatch((bothPlayerUnknownMatchParams as any));
            }).toThrow();
        });
    });

    describe("getAllMatches", () => {
        it(`should return the full list of matches registered`, () => {
            const matchesHistory = eloBoard.getAllMatches();

            expect(matchesHistory).toBeInstanceOf(Array);
            expect(matchesHistory.length).toBeGreaterThan(0);
            expect(matchesHistory.length).toBe(createMatchSpy.mock.calls.length - 4); // match history size should match how many times createMatch has been called (minus throw cases)
        });
    });

    describe("getMatch", () => {
        it(`should return the correct match from the list`, () => {
            const matchParams = { playerAId:0, playerBId:1, matchOutcome: 1 };
            const newlyCreatedMatch = eloBoard.createMatch(matchParams as any);
            const foundCreatedMatch = eloBoard.getMatch(newlyCreatedMatch.id);

            expect(foundCreatedMatch).toEqual(newlyCreatedMatch); // is clone
            expect(foundCreatedMatch).not.toBe(newlyCreatedMatch); // is not identity object (prevent match data tempering)
            expect(foundCreatedMatch).not.toBeNull();
        });

        it(`should return null if match id do not exist`, () => {
            const nonExistentMatch = eloBoard.getMatch(1492);

            expect(nonExistentMatch).toBeNull();
        });
    });

    describe("getPlayerMatches", () => {
        it(`should return the correct matches from the players list`, () => {
            const targetedPlayer = eloBoard.getPlayer(0);
            const foundPlayerMatches = eloBoard.getPlayerMatches(0);

            expect(foundPlayerMatches.map(match => match.id)).toEqual((targetedPlayer as Player).matches);
        });

        it(`should return the all matches where player is listed as player`, () => {
            const targetPlayerId = 0;
            const foundPlayerMatches = eloBoard.getPlayerMatches(targetPlayerId);
            const selfFilteredMatchHistory = eloBoard.getAllMatches().filter(match => ((match.playerAId === targetPlayerId) || (match.playerBId === targetPlayerId)));

            expect(foundPlayerMatches).toEqual(selfFilteredMatchHistory);
        });

        it(`should throw if player do non exist`, () => {
            expect(() => {
                eloBoard.getPlayerMatches(1492);
            }).toThrow();
        });
    });

    describe("getMatchExpectancy", () => {
        it(`should return the correct expectancy for the virtual match`, () => {
            const playerA = eloBoard.getPlayer(0);
            const playerB = eloBoard.getPlayer(1);
            const calculatedExpectancy = eloBoard.getMatchExpectancy((playerA as Player).id, (playerB as Player).id);
            const reverseCalculatedExpectancy = eloBoard.getMatchExpectancy((playerB as Player).id, (playerA as Player).id);
            const manuallyCalculatedExpectancy = expectedScore({ playerRank: (playerA as Player).currentRank, opponentRank: (playerB as Player).currentRank });
            const reverseManuallyCalculatedExpectancy = expectedScore({ playerRank: (playerB as Player).currentRank, opponentRank: (playerA as Player).currentRank });

            expect(calculatedExpectancy).toBeCloseTo(manuallyCalculatedExpectancy);
            expect(reverseCalculatedExpectancy).toBeCloseTo(reverseManuallyCalculatedExpectancy);
            expect(reverseCalculatedExpectancy).toBeCloseTo(1 - manuallyCalculatedExpectancy);
            expect(calculatedExpectancy).toBeCloseTo(1 - reverseManuallyCalculatedExpectancy);
        });
    });
});
/**
 * A player's expected score is their probability of winning plus half their probability of drawing. Thus, an expected score of 0.75 could represent a 75% chance of winning, 25% chance of losing, and 0% chance of drawing. On the other extreme it could represent a 50% chance of winning, 0% chance of losing, and 50% chance of drawing.
 * @param playersEloRanks
 * @returns expected score (0 - 1)
 */
function expectedScore(playersEloRanks) {
    const exponent = (playersEloRanks.opponentRank - playersEloRanks.playerRank) / 400;
    return 1 / (1 + Math.pow(10, exponent));
}
/**
 * Evaluates the elo rank shift that happens based on players ranks, match outcome and K factor
 * @param params object parameters: actualScore = match(es) score outcome, expectedScore = theoritical match(es) score outcome, kFactor - maximum score adjustment per game
 * @returns score variations to be applied to player ranking
 */
function scoreDifferential(params) {
    const { actualScore, expectedScore, kFactor } = params;
    return kFactor * (actualScore - expectedScore);
}
/**
 * Evaluate player and opponent ELO rank change after match is decided
 * @param matchDescriptor player and opponent match full descriptor
 * @returns player and opponent change in ranks post match
 */
function monoMatchCalculator(matchDescriptor) {
    const { playerRank, playerKFactor, opponentRank, opponentKFactor, matchOutcome } = matchDescriptor;
    const expectedPlayerMatchScore = expectedScore({ playerRank, opponentRank });
    const playerScoreDiff = Math.round(scoreDifferential({ actualScore: matchOutcome, expectedScore: expectedPlayerMatchScore, kFactor: playerKFactor }));
    const expectedOpponentMatchScore = expectedScore({ playerRank: opponentRank, opponentRank: playerRank });
    const opponentScoreDiff = Math.round(scoreDifferential({ actualScore: 1 - matchOutcome, expectedScore: expectedOpponentMatchScore, kFactor: opponentKFactor }));
    return {
        player: {
            initialRank: playerRank,
            newRank: playerRank + playerScoreDiff,
            rankDiff: playerScoreDiff
        },
        opponent: {
            initialRank: opponentRank,
            newRank: opponentRank + opponentScoreDiff,
            rankDiff: opponentScoreDiff
        }
    };
}
/**
 * Calculate ELO ranking changes for multi matches sequence (only considers players rank shift and act as average rank change for average performance)
 * @param matchDescriptors - all necessary info for multi match palyer ranking calculation
 * @returns rank change details
 */
function multiMatchCalculator(matchDescriptors) {
    const { playerRank, playerKFactor, matchesSetup } = matchDescriptors;
    // throw early if empty matches descriptors
    if (!Array.isArray(matchesSetup) || matchesSetup.length === 0)
        throw new Error('multiMatchCalculator - no valid matches provided in "matchesSetup" property');
    // sum up expected and actual scores for all considered matches
    const expectedScoresSum = matchesSetup
        .map(match => expectedScore({ playerRank, opponentRank: match.opponentRank }))
        .reduce((acc, curr) => acc + curr, 0);
    const actualScoresSum = matchesSetup.reduce((acc, curr) => acc + curr.matchOutcome, 0);
    // evaluate rank shift
    const rankDiff = Math.round(scoreDifferential({ actualScore: actualScoresSum, expectedScore: expectedScoresSum, kFactor: playerKFactor }));
    return {
        initialRank: playerRank,
        newRank: playerRank + rankDiff,
        rankDiff
    };
}

// UTILS
function rangeDescriptorParser(range) {
    // check string format validity
    const validFormat = /^(\(|\[)(\d+|\d+.?\d+),(\d+|\d+.?\d+)(\)|\])$/g;
    const rangeMatches = validFormat.exec(range);
    if (rangeMatches === null)
        throw new Error(`range description invalid: ${range}`);
    const lowerBoundValue = parseFloat(rangeMatches[2]);
    const upperBoundValue = parseFloat(rangeMatches[3]);
    if (lowerBoundValue > upperBoundValue)
        throw new Error(`range description invalid, lower bound is superior to upper bound: ${range}`);
    return [
        {
            lowerBoundValue,
            isIncluded: (rangeMatches[1] === '(')
        },
        {
            upperBoundValue,
            isIncluded: (rangeMatches[4] === ')')
        }
    ];
}
/**
 * K FACTOR RULE
 * STRATEGIES CATALOGUE
 *
 * you can always provide your own custom strategy by providing a custom KFactorRule function
 */
/**
 * always return the same K factor value
 * @param kFactorValue
 * @returns
 */
function fixedKFactorRuleBuilder(kFactorValue) {
    return () => kFactorValue;
}
/**
 * return k factor value based on player rank
 * range examples
 * range = (0,2100), between 0 and 2100
 * range = [2100,2400), between 2100 (excluded) and 2400 (included)
 * range = [2400,2600], between 2400 (excluded) and 2600 (excluded)
 * @param kFactorStages
 */
function adaptToPlayerRankKFactorRuleBuilder(kFactorStages) {
    // parse range descriptor for each stage
    const formatedKFactorStages = kFactorStages.map(stage => ({
        kFactorValue: stage.kFactorValue,
        range: rangeDescriptorParser(stage.range)
    }));
    return (player) => {
        // find matching stages
        const matchingStage = formatedKFactorStages.filter(stage => {
            const isMinBoundIncluded = stage.range[0].isIncluded;
            const isMaxBoundIncluded = stage.range[1].isIncluded;
            const minBound = stage.range[0].lowerBoundValue;
            const maxBound = stage.range[1].upperBoundValue;
            return (isMinBoundIncluded && isMaxBoundIncluded)
                ? (minBound <= player.currentRank && player.currentRank <= maxBound)
                : (!isMinBoundIncluded && isMaxBoundIncluded)
                    ? (minBound < player.currentRank && player.currentRank <= maxBound)
                    : (isMinBoundIncluded && !isMaxBoundIncluded)
                        ? (minBound <= player.currentRank && player.currentRank < maxBound)
                        : (minBound < player.currentRank && player.currentRank < maxBound);
        });
        // throw if no match found
        if (matchingStage.length === 0)
            throw new Error(`no match found for provided stages: ${kFactorStages} (player rank: ${player.currentRank})`);
        // throw if more than one match found
        if (matchingStage.length > 1)
            throw new Error(`multiple matches found for provided stages: ${kFactorStages} (player rank: ${player.currentRank})`);
        return matchingStage[0].kFactorValue;
    };
}

/* ABSTRACT - ELO RANKING BOARD  */
class AEloRankingBoard {
    _initialRank;
    _kFactorRule;
    constructor(initialRank, kFactorRule) {
        this._initialRank = initialRank;
        this._kFactorRule = kFactorRule;
    }
    /* GETTERS SETTERS */
    get initialRank() { return this._initialRank; }
    set initialRank(newInitialRank) { this._initialRank = newInitialRank; } // only applies to players created after the update
    get kFactorRule() { return this._kFactorRule; }
    set kFactorRule(newkFactorRule) { this._kFactorRule = newkFactorRule; } // only applies to matches created after the update
}

/* IN-MEMORY - ELO RANKING BOARD (no data persistence) */
class EloRankingBoard extends AEloRankingBoard {
    _players = [];
    _matches = [];
    constructor(initialRank, kFactorRule) {
        super(initialRank, kFactorRule);
    }
    /* PRIVATE METHODS */
    // same as public version but return object is not a clone (enables mutations for updates)
    _getPlayer(playerId) {
        const foundPlayer = this._players.find(player => (player.id === playerId));
        return (foundPlayer)
            ? foundPlayer
            : null;
    }
    /* PUBLIC METHODS */
    createPlayer(player) {
        // generate ID for new player (overwrite eventual given id in parameters)
        const newPlayerId = this._players.length;
        // merge new player infos
        const newPlayer = Object.assign({
            creationDate: Date.now(),
            lastPlayed: null,
            initialRank: this.initialRank,
            currentRank: this.initialRank,
            matches: []
        }, player, { id: newPlayerId });
        // register player in players roster and return created player (clone)
        this._players.push(newPlayer);
        return { ...newPlayer };
    }
    deletePlayer(playerId) {
        this._players = this._players.filter(player => (player.id !== playerId));
    }
    getPlayer(playerId) {
        const foundPlayer = this._players.find(player => (player.id === playerId));
        return (foundPlayer)
            ? { ...foundPlayer, matches: [...foundPlayer.matches] }
            : null;
    }
    getAllPlayers() { return this._players.map(player => ({ ...player })); } // return new array of clones to protect players roster
    getAllMatches() { return this._matches.map(match => ({ ...match })); } // return new array of clones to protect match history
    getPlayerMatches(playerId) {
        // first get player
        const targetedPlayer = this.getPlayer(playerId);
        if (!targetedPlayer)
            throw new Error(`EloRankingBoard/getPlayerMatches - can't find matches for player #${playerId}, player do not exist`);
        // find all related matches from history (send clones)
        return this._matches
            .filter(match => targetedPlayer?.matches.includes(match.id))
            .map(match => ({ ...match }));
    }
    getMatch(matchId) {
        const foundMatch = this._matches.find(match => (match.id === matchId));
        return (foundMatch)
            ? { ...foundMatch }
            : null;
    }
    createMatch(match) {
        const now = Date.now();
        // generate ID for new match
        const newMatchId = this._matches.length;
        // get players
        if (match.playerAId === match.playerBId)
            throw new Error(`EloRankingBoard/createMatch - same player for both sides of the match: playerA #${match.playerAId} = playerB #${match.playerBId}`);
        const playerA = this._getPlayer(match.playerAId);
        const playerB = this._getPlayer(match.playerBId);
        if (!playerA || !playerB)
            throw new Error(`EloRankingBoard/createMatch - one or both players in a match can't be found: playerA #${match.playerAId} & playerB #${match.playerBId}`);
        // evaluate players K factor
        const playerAKFactor = this.kFactorRule(playerA);
        const playerBKFactor = this.kFactorRule(playerB);
        // merge new player infos
        const newMatch = Object.assign({}, match, {
            id: newMatchId,
            creationDate: now,
            resolutionDate: now,
            playerARank: playerA?.currentRank,
            playerBRank: playerB?.currentRank,
            playerAKFactor,
            playerBKFactor
        });
        // register match in matches history
        this._matches.push(newMatch);
        // update players ranks based on match outcome
        const calculatedMatchOutcome = monoMatchCalculator({
            playerRank: playerA?.currentRank,
            playerKFactor: playerAKFactor,
            opponentRank: playerB?.currentRank,
            opponentKFactor: playerBKFactor,
            matchOutcome: match.matchOutcome
        });
        playerA.currentRank = calculatedMatchOutcome.player.newRank;
        playerA.matches.push(newMatch.id);
        playerB.currentRank = calculatedMatchOutcome.opponent.newRank;
        playerB.matches.push(newMatch.id);
        playerA.lastPlayed = playerB.lastPlayed = newMatch.resolutionDate;
        return { ...newMatch };
    }
    getMatchExpectancy(playerAId, playerBId) {
        // get players
        if (playerAId === playerBId)
            throw new Error(`EloRankingBoard/getMatchExpectancy - same player for both sides of the match: playerA #${playerAId} = playerB #${playerBId}`);
        const playerA = this.getPlayer(playerAId);
        const playerB = this.getPlayer(playerBId);
        if (!playerA || !playerB)
            throw new Error(`EloRankingBoard/getMatchExpectancy - one or both players in a match can't be found: playerA #${playerAId} & playerB #${playerBId}`);
        // expected score of A against opponent B
        return expectedScore({ playerRank: playerA.currentRank, opponentRank: playerB.currentRank });
    }
}

// elo engine (core elo system)
const EloEngine = {
    expectedScore: expectedScore,
    scoreDifferential: scoreDifferential,
    monoMatchCalculator: monoMatchCalculator,
    multiMatchCalculator: multiMatchCalculator
};
// elo ranking board
const EloRankingBoardInMemory = EloRankingBoard;
// BUILT-IN K factor rule makers
const fixedKFactorRuleMaker = fixedKFactorRuleBuilder;
const adaptToPlayerRankKFactorRuleMaker = adaptToPlayerRankKFactorRuleBuilder;

export { EloEngine, EloRankingBoardInMemory, adaptToPlayerRankKFactorRuleMaker, fixedKFactorRuleMaker };

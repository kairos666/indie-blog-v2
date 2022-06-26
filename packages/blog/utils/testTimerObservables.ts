import { timer, take, Observable, Subject, switchAll, map, startWith } from 'rxjs';

export const testSoftTimerObservableBuilder = (questionsCount:number, durationTimePerQuestion:number):Observable<0> => {
    const testDuration:number = questionsCount * durationTimePerQuestion * 1000 + 1500; // test duration with grace period of 1.5s

    return timer(testDuration).pipe(take(1));
}

export const testHardTimerObservableBuilder = (questionsCount:number, durationTimePerQuestion:number):{ observable:Observable<any>, answerRegisterCb:() => void } => {
    const userAnswerSubject:Subject<void> = new Subject();

    const timerObservable = userAnswerSubject.pipe(
        startWith('test-start-dummy-event'),
        map(() => timer(durationTimePerQuestion * 1000).pipe(take(1))), // each time user answers provide a new 1 question timer
        switchAll(), // always keep track of latest timer
        take(questionsCount) // completes if all questions have timed out
    )

    return {
        observable: timerObservable,
        answerRegisterCb: () => userAnswerSubject.next()
    }
}
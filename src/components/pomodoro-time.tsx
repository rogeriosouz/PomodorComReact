import React, { useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './botton';
import { Timer } from './timer';

import bellStart from '../sounds/src_sounds_bell-start.mp3';
import bellFinish from '../sounds/src_sounds_bell-finish.mp3';
import { secondsToTime } from '../utils/seconds-to-time';

const audioStartWorking = new Audio(bellStart);
const audioFinishWorking = new Audio(bellFinish);

interface Props {
  PomodoroTime: number;
  shortRestTime: number;
  longRestTimer: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const pomodoroTimer = props.PomodoroTime * 60;

  const [mainTime, setMainTime] = React.useState(pomodoroTimer);
  const [timeCounting, setTimeCounting] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = React.useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = React.useState(0); // variavel que quarda qtd de cliclos completos
  const [fullWorkingTime, setFullWorkingTime] = React.useState(0); // variavel que quarda horas trabalhadas
  const [numberOfPomodoros, setNumberOfPomodoros] = React.useState(0); // variavel que quarda qtd de pomodoros

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null,
  );

  // config do trabalho
  const confiWorking = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(pomodoroTimer); // pomodoroTimer <----> props.PomodoroTime * 60
    audioStartWorking.play();
  }, [setTimeCounting, setWorking, setResting, setMainTime, pomodoroTimer]); // pomodoroTimer <----> props.PomodoroTime * 60

  // config do modo de descanço..
  const confiResting = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
        setMainTime(props.longRestTimer * 60);
      } else {
        setMainTime(props.shortRestTime * 60);
      }
      audioFinishWorking.play();
    },
    [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.shortRestTime,
      props.longRestTimer,
    ],
  );

  // useEffect = pega toda a modificao que aconteçe e executa uma fuçao -> ele vigia
  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      confiResting(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      confiResting(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) confiWorking();
  }, [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    numberOfPomodoros,
    completedCycles,
    confiResting,
    setCyclesQtdManager,
    confiWorking,
    props.cycles,
  ]);

  return (
    <div className="pomodoro">
      <h1>You are: {working ? 'working' : 'resting'}</h1>
      <div>{<Timer mainTimer={mainTime} />}</div>

      <div className="controls">
        <Button text={'work'} onClick={() => confiWorking()} />
        <Button text={'reset'} onClick={() => confiResting(false)} />
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'pasuse' : 'play'}
          onClick={() => setTimeCounting(!timeCounting)}
        />
      </div>

      <div className="details">
        <p>clicos cloncluidos: {completedCycles}</p>
        <p>horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>pomodoros concluidos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}

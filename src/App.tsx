import React from 'react';
import { PomodoroTimer } from './components/pomodoro-time';

function App(): JSX.Element {
  return (
    <div className="conteiner">
      <PomodoroTimer
        PomodoroTime={25}
        shortRestTime={5}
        longRestTimer={15}
        cycles={4}
      />
    </div>
  );
}

export default App;

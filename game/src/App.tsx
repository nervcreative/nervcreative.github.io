import { ReactElement } from 'react';
import TestComponent from './TestComponent';

function App(): ReactElement {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Game Infrastructure Test</h1>
        <TestComponent />
      </header>
    </div>
  );
}

export default App;
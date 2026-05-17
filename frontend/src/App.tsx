import {router} from './routes/Router';
import { RouterProvider } from 'react-router-dom';

function App() {
  return <div className="mobile-wrapper">
      <RouterProvider router={router} />
    </div>;
}

export default App;
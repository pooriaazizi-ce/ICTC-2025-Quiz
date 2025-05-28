import './App.css';
import AddForm from './utils/adding_form';
import ShowTop from './utils/show_top';
import OverallTop from './utils/overal_top';

const COLORS = ['قرمز', 'زرد', 'سبز', 'آبی'];

function App() {
  return (
    <div id="main-wrapper">
      {AddForm()}
      {ShowTop()}
      {OverallTop()}
    </div>
  );
}

export default App;

import './App.css';
import HomePage from './components/Home/HomePage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NavBar from './components/NavBar/NavBar';

function App() {
	return (
		<Router>
			<NavBar />
			<div className='App'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;

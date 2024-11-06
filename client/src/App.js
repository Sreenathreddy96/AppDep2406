import logo from './logo.svg';
import './App.css';
import Signup from './components/Signup';
import Login from "./components/Login";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Leaves from "./components/Leaves";
import Tasks from "./components/Tasks";
import Signout from "./components/Signout";
import EditProfile from './components/EditProfile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/tasks" element={<Tasks></Tasks>}>Tasks</Route>
          <Route path="/leaves" element={<Leaves></Leaves>}>Leaves</Route>
          <Route path="/editProfile" element={<EditProfile></EditProfile>}>Leaves</Route>
          <Route path="/signout" element={<Signout></Signout>}>Signout</Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

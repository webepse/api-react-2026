import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CustomersPage from "./pages/CustomersPage";
import CustomerPageWithPagination from "./pages/CustomerPageWithPagination";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";
import {useState} from "react";
import PrivateRoute from "./components/PrivateRoute";

authAPI.setup()

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated())

    return (
        <Router>

            <Navbar isAuthenticated={isAuthenticated} onLogout={setIsAuthenticated}/>
            <main className="container pt-5">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/customers" element={
                        <PrivateRoute isAuthenticated={isAuthenticated} >
                            <CustomersPage />
                        </PrivateRoute>
                    } />
                    <Route path="/customerspage" element={
                        <PrivateRoute isAuthenticated={isAuthenticated} >
                            <CustomerPageWithPagination />
                        </PrivateRoute>
                    } />
                    <Route path="/invoices" element={
                        <PrivateRoute isAuthenticated={isAuthenticated} >
                            <InvoicesPage />
                        </PrivateRoute>
                    } />
                    <Route path="/login" element={<LoginPage onLogin={setIsAuthenticated} />} />
                </Routes>
            </main>
        </Router>
  );
}

export default App;

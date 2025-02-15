import { Routes, Route } from 'react-router-dom';
import {Layout} from './components/Layout';
import {LoginPage} from './pages/LoginPage';
import {SignupPage} from './pages/SignupPage';
import {ProjectsPage} from './pages/ProjectsPage';
import {ProjectDetailsPage} from './pages/ProjectDetailsPage';
import {NotFoundPage} from './pages/NotFoundPage';
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/login" element={
                        <ProtectedRoutes>
                            <LoginPage />
                        </ProtectedRoutes>
                    }
                />
                <Route path="/signup" element={
                        <ProtectedRoutes>
                            <SignupPage />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoutes>
                            <ProjectsPage />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/projects/:projectId"
                    element={
                        <ProtectedRoutes>
                            <ProjectDetailsPage />
                        </ProtectedRoutes>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Layout>
    );
}

export default App;

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
                        <Layout>
                            <ProtectedRoutes>
                                <ProjectsPage />
                            </ProtectedRoutes>
                        </Layout>
                    }
                />
                <Route
                    path="/projects/:projectId"
                    element={
                        <Layout>
                            <ProtectedRoutes>
                                <ProjectDetailsPage />
                            </ProtectedRoutes>
                        </Layout>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
    );
}

export default App;

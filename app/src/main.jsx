import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import {ApolloProvider} from "@apollo/client";
import {client} from "./services/apolloClient.js";

ReactDOM.createRoot(document.getElementById('root')).render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    </ApolloProvider>
);

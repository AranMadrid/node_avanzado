'use strict'

const axios = require('axios');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWIwMjg5ZmFkYTcyYzJmNzg3MzgwNTkiLCJpYXQiOjE1ODg2ODgzNTEsImV4cCI6MTYyMDIyNDM1MX0.qF8eWfqAOEmWFXZjb5mzhATNnsVnmC2n5WeCU6rUKFA';
const API_URL_BASE = 'http://localhost:3000/api/v1';

const api = () => {
    return {
        getAds: async(search) => {
            try {
                const endpoint = `${API_URL_BASE}/anuncios${search}`;
                const response = await axios(endpoint, {
                    method: 'GET',
                    headers: { 'Authorization': API_KEY },
                    withCredentials: true,
                });

                const results = await response.data;
                return results;
            } catch (error) {
                console.error("Error en apiCalls.js (getAds):", error.message);
                throw error;
            }
        },
        getTags: async(search) => {
            try {
                const endpoint = `${API_URL_BASE}/tags${search}`;
                const response = await axios(endpoint, {
                    method: 'GET',

                });

                const results = await response.data;
                return results;
            } catch (error) {
                console.error("Error en apiCalls.js (getTags):", error.message);
                throw error;
            }
        },
    };
};

module.exports = api;
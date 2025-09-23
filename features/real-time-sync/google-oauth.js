// Google OAuth2 Authentication for Figma Plugin
// Phase 3: Real-time sync authentication

class GoogleOAuth {
    constructor() {
        this.clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with actual client ID
        this.redirectUri = 'https://your-domain.com/oauth/callback'; // Replace with actual redirect URI
        this.scopes = [
            'https://www.googleapis.com/auth/spreadsheets.readonly',
            'https://www.googleapis.com/auth/drive.readonly'
        ];
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        this.isAuthenticated = false;
        
        // Load stored tokens if available
        this.loadStoredTokens();
    }
    
    // Load tokens from secure storage
    loadStoredTokens() {
        try {
            const stored = localStorage.getItem('google_oauth_tokens');
            if (stored) {
                const tokens = JSON.parse(stored);
                this.accessToken = tokens.accessToken;
                this.refreshToken = tokens.refreshToken;
                this.tokenExpiry = tokens.expiry;
                
                // Check if token is still valid
                if (this.tokenExpiry && Date.now() < this.tokenExpiry) {
                    this.isAuthenticated = true;
                    console.log('Google OAuth: Loaded valid stored tokens');
                } else {
                    console.log('Google OAuth: Stored tokens expired, need refresh');
                    this.isAuthenticated = false;
                }
            }
        } catch (error) {
            console.error('Google OAuth: Failed to load stored tokens', error);
            this.isAuthenticated = false;
        }
    }
    
    // Save tokens to secure storage
    saveTokens(accessToken, refreshToken, expiresIn) {
        try {
            const expiry = Date.now() + (expiresIn * 1000) - 60000; // 1 minute buffer
            const tokens = {
                accessToken,
                refreshToken,
                expiry
            };
            
            localStorage.setItem('google_oauth_tokens', JSON.stringify(tokens));
            
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.tokenExpiry = expiry;
            this.isAuthenticated = true;
            
            console.log('Google OAuth: Tokens saved successfully');
        } catch (error) {
            console.error('Google OAuth: Failed to save tokens', error);
        }
    }
    
    // Start OAuth2 flow
    async startAuthFlow() {
        try {
            console.log('Google OAuth: Starting authentication flow');
            
            // Build authorization URL
            const authUrl = this.buildAuthUrl();
            
            // Open OAuth popup
            const popup = window.open(
                authUrl,
                'google-oauth',
                'width=500,height=600,scrollbars=yes,resizable=yes'
            );
            
            // Wait for popup to complete
            return new Promise((resolve, reject) => {
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        reject(new Error('Authentication cancelled by user'));
                    }
                }, 1000);
                
                // Listen for auth completion
                window.addEventListener('message', (event) => {
                    if (event.origin !== window.location.origin) return;
                    
                    if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
                        clearInterval(checkClosed);
                        popup.close();
                        
                        const { accessToken, refreshToken, expiresIn } = event.data;
                        this.saveTokens(accessToken, refreshToken, expiresIn);
                        
                        resolve({
                            success: true,
                            message: 'Authentication successful'
                        });
                    } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
                        clearInterval(checkClosed);
                        popup.close();
                        
                        reject(new Error(event.data.error || 'Authentication failed'));
                    }
                });
            });
            
        } catch (error) {
            console.error('Google OAuth: Authentication flow failed', error);
            throw error;
        }
    }
    
    // Build authorization URL
    buildAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            response_type: 'code',
            scope: this.scopes.join(' '),
            access_type: 'offline',
            prompt: 'consent'
        });
        
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    
    // Exchange authorization code for tokens
    async exchangeCodeForTokens(code) {
        try {
            const response = await fetch('/api/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code,
                    redirect_uri: this.redirectUri,
                    client_id: this.clientId
                })
            });
            
            if (!response.ok) {
                throw new Error(`Token exchange failed: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Google OAuth: Token exchange failed', error);
            throw error;
        }
    }
    
    // Refresh access token
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }
        
        try {
            console.log('Google OAuth: Refreshing access token');
            
            const response = await fetch('/api/oauth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: this.refreshToken,
                    client_id: this.clientId
                })
            });
            
            if (!response.ok) {
                throw new Error(`Token refresh failed: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.saveTokens(data.access_token, this.refreshToken, data.expires_in);
            
            return data.access_token;
            
        } catch (error) {
            console.error('Google OAuth: Token refresh failed', error);
            this.isAuthenticated = false;
            throw error;
        }
    }
    
    // Get valid access token (refresh if needed)
    async getValidAccessToken() {
        if (!this.isAuthenticated || !this.accessToken) {
            throw new Error('Not authenticated');
        }
        
        // Check if token needs refresh
        if (Date.now() >= this.tokenExpiry) {
            console.log('Google OAuth: Access token expired, refreshing...');
            await this.refreshAccessToken();
        }
        
        return this.accessToken;
    }
    
    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated && this.accessToken && Date.now() < this.tokenExpiry;
    }
    
    // Sign out
    signOut() {
        try {
            localStorage.removeItem('google_oauth_tokens');
            this.accessToken = null;
            this.refreshToken = null;
            this.tokenExpiry = null;
            this.isAuthenticated = false;
            
            console.log('Google OAuth: User signed out');
        } catch (error) {
            console.error('Google OAuth: Sign out failed', error);
        }
    }
    
    // Get user info
    async getUserInfo() {
        try {
            const token = await this.getValidAccessToken();
            
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to get user info: ${response.statusText}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Google OAuth: Failed to get user info', error);
            throw error;
        }
    }
}

// Export for use in Figma plugin
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleOAuth;
} else {
    window.GoogleOAuth = GoogleOAuth;
}

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# SwiftURL Project Instructions

This is a full-stack URL shortening service with the following architecture:

## Backend (Node.js/Express)
- Located in `/backend` directory
- Uses PostgreSQL for persistent storage
- Uses Redis for caching and rate limiting
- Implements URL shortening, custom codes, and analytics
- Includes URL expiration functionality

## Frontend (React)
- Located in `/frontend` directory
- Built with React and Tailwind CSS
- Responsive design for all screen sizes
- Copy-to-clipboard functionality

## Key Features
- URL shortening with auto-generated codes
- Custom short codes with validation
- Click analytics and tracking
- Redis caching for performance
- Rate limiting for API protection
- URL expiration with cleanup
- Comprehensive error handling

## Development Guidelines
- Use async/await for asynchronous operations
- Implement proper error handling and validation
- Follow REST API conventions
- Use environment variables for configuration
- Include comprehensive logging
- Write clean, commented code

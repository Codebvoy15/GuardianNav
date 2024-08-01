# GuardianNav

## Overview

**GuardianNav** is a state-of-the-art navigation system designed to streamline visitor management. It addresses the challenges of navigating across a plant, reduces dependency on manual processes, and provides real-time tracking of visitors within the premises. The system offers voice-assisted navigation, geofencing, and live tracking to enhance the overall visitor experience and improve security measures.

## Features

1. **Voice-Assisted Navigation**:
   - Guides visitors through the plant with clear, voice-based directions.
   - Reduces dependency on other staff members for navigation assistance.

2. **Geofencing**:
   - Alerts both the visitor and the admin when a visitor crosses predefined boundaries.
   - Ensures visitors stay within designated areas, enhancing security.

3. **Live Tracking**:
   - Provides real-time updates on the visitor’s location to the admin.
   - Allows the admin to view the visitor’s current location with a single click.

4. **Streamlined Visitor Management**:
   - Visitors can fill out a form directly upon arrival.
   - Automatic email notifications to the security office, TKM employee, and their manager.
   - All details are saved directly in SharePoint, eliminating manual data entry.



## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- Firebase account

### Installation Steps

1. Clone the repository:

    \`\`\`bash
    git clone https://github.com/Codebvoy15/GuardianNav.git
    cd GuardianNav/Guardian%20Nav
    \`\`\`

2. Install dependencies:

    \`\`\`bash
    npm install
    \`\`\`

3. Configure Firebase:

   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project or use an existing one.
   - Obtain the Firebase configuration object and replace it in the \`index.html\` file.

    \`\`\`javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID"
    };
    \`\`\`

4. Deploy the application:

    - Using Firebase Hosting:

      \`\`\`bash
      firebase init
      firebase deploy
      \`\`\`

    - Using a local server for development:

      \`\`\`bash
      npm install -g http-server
      http-server
      \`\`\`

## Usage

1. Open the deployed application URL or the local server URL.
2. Use the dropdown to select the desired location.
3. Click "Navigate" to get voice-assisted directions.
4. Use the "Show Current Location" button to display the current location.
5. The system will automatically handle geofencing alerts and live tracking updates can be viewed by the admin.

## Contact

For any questions or support, please open an issue in the repository or contact the project maintainer:

Github : [Codebvoy15](https://github.com/Codebvoy15)

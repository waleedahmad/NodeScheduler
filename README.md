# Node Scheduler for Facebook Pages

### Setup Instructions

```
# Clone
$ git clone https://github.com/waleedahmad/NodeScheduler.git

# Install depdendencies
$ npm install

# Install nodemon globally
$ npm install -g nodemon

# Build Frontend code and watch for changes
$ npm run watch

# App configuration
$ cp ./config/default_example.json ./config/default.json

# Add configuration to ./config/default.json
# callbackURL must match Facebook app setting 
# valid redirect URIs
{
  "appId" : "YOUR_APP_KEY",
  "appSecret" : "YOUR_APP_SECRET",
  "sessionSecret" : "EXPRESS_SESSION_SECRET",
  "callbackURL" : "https://127.0.0.1:8888/auth/facebook/callback",
  "scheduler_timezone" : "Asia/Karachi"
}

# Run web server
$ npm run dev-server
```

![alt text](https://i.imgur.com/kPIHYCZ.png)

![alt text](https://i.imgur.com/zeCQXFb.png)

![alt text](https://i.imgur.com/dYHuo7t.png)




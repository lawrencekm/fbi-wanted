 Integration with External API
1. Understanding of RESTful API concepts.
2. Ability to fetch data from the FBI Wanted API endpoints.
3. How errors and edge cases are handled (e.g., rate-limiting, malformed requests,
interruptions).



Improvements

Graphql endpoint to prevent underfetching or overfetching





















docker exec -it react-node-backend sh
docker exec -it react-node-frontend sh
# Build stage
FROM node:alpine AS build
WORKDIR /react-app
COPY ./package*.json /react-app/
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production
COPY --from=build /react-app/.next /usr/share/nginx/html
COPY --from=build /react-app/public /usr/share/nginx/html

EXPOSE 80
EXPOSE 8092

CMD ["nginx", "-g", "daemon off;"]


docker run -e FBI_WANTED_API_URL=xxx wanted-backend:latest

https://api.fbi.gov/@wanted-person/b166d627e11149aa82c02d1533e3b650


nohup npm start > output.log 2>&1 &

nohup npm start > ../../frontend.log 2>&1 &

nohup npm start > ../../backend.log 2>&1 &

root@vmi2407673:/var/www/fbi-wanted/server# nohup npm start > ../../backend.log 2>&1 &
[1] 1226
root@vmi2407673:/var/www/fbi-wanted/server#
root@vmi2407673:/var/www/fbi-wanted/server#
root@vmi2407673:/var/www/fbi-wanted/server#
root@vmi2407673:/var/www/fbi-wanted/server#
root@vmi2407673:/var/www/fbi-wanted/server#
root@vmi2407673:/var/www/fbi-wanted/server#
root@vmi2407673:/var/www/fbi-wanted/server#
root@vmi2407673:/var/www/fbi-wanted/server# cd ../client/
root@vmi2407673:/var/www/fbi-wanted/client# nohup npm start > ../../frontend.log 2>&1 &
[2] 1314


There are no errors in your Next.js build output. Everything compiled successfully. ✅

What This Output Means:
"✓ Compiled successfully" → No syntax errors, everything built correctly.
"Skipping linting" → Linting was skipped, but this is not a critical issue unless you explicitly need it.
"✓ Checking validity of types" → No TypeScript errors.
"✓ Generating static pages (9/9)" → All your static pages were generated successfully.
"✓ Finalizing page optimization" → Optimization was completed without issues.
Performance Insights:
Static Routes (○) → Pages like /, /dashboard, /auth/signin, etc., are pre-rendered for better performance.
Dynamic Routes (ƒ) → /dashboard/[uid] and /api/auth/[...nextauth] are server-rendered as needed.
First Load JS → The shared JavaScript bundles (like 105 kB for app pages) are within a reasonable size.
Any Actions Needed?
Tto reduce JS bundle size, you can:

Analyze with next build && next analyze (using next-bundle-analyzer).
Optimize images with next/image instead of <img>.
Reduce unused dependencies if the bundle seems large.
Otherwise, everything is working fine! 🎉




-----------
Step 2: Setting Up the Droplet
Now that we’ve created the droplet, we need to prepare it so that it can accept incoming connections and route those connections to our Next.js application.

SSH into your droplet using the IP address and the SSH key you provided during the droplet creation:

ssh root@<DROPLET_IP>
Update and upgrade the packages on the droplet:

sudo apt update && sudo apt upgrade -y
Install the required packages:

sudo apt install -y nodejs npm nginx
Step 3: Configuring Nginx
Nginx is the tool that will handle all the routing to our Next.js application. Create a new Nginx configuration file for your Next.js application:

sudo nano /etc/nginx/sites-available/nextjs
Paste the following configuration, replacing server_name with your domain name or droplet IP address:

server {
  listen 80;
  server_name YOUR_IP_ADDRESS;
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
Save and close the file. Create a symbolic link to enable the configuration:

sudo ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/
Test the Nginx configuration for any syntax errors:

sudo nginx -t
image

If the configuration test is successful, restart Nginx:

sudo service nginx restart
Step 4: Deploying the Next.js Application
Next up, we’ll get a Next.js application onto the Droplet. There are many options to do this.

Create an SSH key on the server, connect it to your GitHub account, and clone your repo
Create a Next.js application on the Droplet
For this tutorial, we will be creating a brand new Next.js application in our Droplet.

SSH back into your droplet:

ssh root@<DROPLET_IP>
Create a new Next.js application and follow the prompts:

cd /var/www
npx create-next-app nextjs
Navigate to the Next.js application directory:

cd nextjs
Install the application dependencies:

npm install
Build the Next.js application:

npm run build
Finally, start the Next.js application:

npm start
Your Next.js application is now deployed and accessible at your domain name or droplet IP address. To keep your application running in the background and automatically restart on crashes or server reboots, you should use a process manager like PM2.

Step 5: Setting Up PM2 Process Manager
We ran npm start from within our Droplet. Sometimes this command may stop running for reasons like the server restarted or it needed to install updates. We will use a tool called PM2 to make sure that our Next.js application is always running. PM2 will even restart the Next.js application if it goes down.

To install PM2 globally on your droplet:

sudo npm install -g pm2
Navigate to the Next.js application directory (if not already there):

cd /var/www/nextjs
Start the Next.js application using PM2:

pm2 start npm --name "nextjs" -- start
This command will start the Next.js application with the name “nextjs” using the npm start command. PM2 will automatically restart the application if it crashes or if the server reboots.

To ensure PM2 starts on boot, run:

pm2 startup
This command will generate a script that you can copy and paste into your terminal to enable PM2 to start on boot.

Save the current PM2 processes:

pm2 save
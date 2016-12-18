#Requirements:
- InfluxDB
- Node
- npm

#Installation:
After cloning the Project, the required modules/libraries have to be downloaded.
To do so, execute the following command inside terminal/command line

	npm install

in /yourPath/SmartChair/database and
in /yourPath/SmartChair/database/server

All required libs (except the ones listed under #requirements) will be downloaded
There may occur some warnings; these can be ignored, as long as there are no errors.

#Starting the application: 
Make sure the InfluxDB is up and running.
after this, in /yourPath/SmartChair/database run the following command in terminal/command line:

	npm run start2

this will start the server and notify you with the respective address and port it runs on when complete.
After this, open any browser and open the given address. 


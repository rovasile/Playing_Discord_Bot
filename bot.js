const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');

const token = '_';

var serverList;

bot.login(token);
bot.on('ready', ()=>{console.log("boi am i ready the fuck up");
	 bot.user.setPresence({
		 status: 'online',
        activity: {
            name: 'type !!help for instructions',
            type: "STREAMING",
            url: "https://www.twitch.tv/sykewronglink"
        }
    });
    
    
    fs.readFile('servers.json', 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    // parse JSON object
    serverList = JSON.parse(data.toString());

    // print JSON object
    //console.log(serverList);
});

    
    
	});
	


bot.on('error', console.error);

bot.on('message',(message)=>{
	if (message.member==null)
	return;
	
	if (message.member.user.bot)
	return;
	
	if (message.member.hasPermission("ADMINISTRATOR")) 
	{//return console.log('THIS USER HAS ADMINISTRATOR PERMISSIONS!')

	if(message.content.substring(0,2).localeCompare("!!")==0)
	{	
		messageText=message.content.substring(2,message.content.length);
		//console.log(messageText);
		
		switch(messageText.split(" ")[0])
		{
		case "current" : if((message.guild.id in serverList)) message.channel.send("This server's selected game is "+serverList[message.guild.id]+".");  
							else message.channel.send("This server hasn't selected a game yet. Please use the following example to set up a game: '!!change GameName' (it's case sensitive).");
							break;
		case "change": var newGame=messageText.substring(messageText.indexOf(" ")+1,messageText.length); 
						
						if((message.guild.id in serverList)) 
						{serverList[message.guild.id]=newGame; message.channel.send("New selection: "+serverList[message.guild.id]);}
						else
						{	let newGuild=message.guild.id;
										
							serverList[newGuild]=newGame;
							message.channel.send("Selection initiated: "+serverList[message.guild.id]+".\nPlease move the newly created role (\"Currently Playing\") to the top of the roles list (Settings) to make the separation visible.");
							
							////////////////////////////////////creating the role
							//console.log("GUILD?? = "+message.guild.available);
							let doesRoleExist = message.guild.roles.cache.find(asd => asd.name === "Currently Playing");
							if (doesRoleExist === undefined)
							{
								message.guild.roles.create({
								  data: {
									name: 'Currently Playing',
									hoist: true,
								  },
								  reason: 'we needed the role for the bot to work',
								})
								  .then(console.log)
								  .catch(console.error);
								  console.log("role created, didn't exist");
							} else console.log("role existed, not created");
							  
							
						}	//THIS IS WHERE IT'S DONE INITIATIONG
						const data = JSON.stringify(serverList);
						fs.writeFile('servers.json', data, (err) => {
							if (err) {
								throw err;
							}
							//console.log("JSON data is saved.");
						});
						
						break;
		case "help": message.channel.send("To see the current selection, type '!!current'.\nTo change the selection, type '!!change GameName' (it's case sensitive). "); break;
		
		}
		
	}
	}
	
	});

bot.on('presenceUpdate',function(oldmember, newmember){
	let serverName=newmember.guild.id;
	
	if (!(serverName in serverList))
	return;
	
	let gameName=serverList[serverName];
	
	
	//console.log("Somedone done did wumting with aasdjiasijadkd"+newmember.user.username);
	let name = newmember.user.username;
	
	console.log("GAMENAME of "+name+"  FROM  "+serverName);

	//console.log("NOU ->"+newmember.activities);

	if (newmember.activities === undefined || newmember.activities.length==0)
	{var newact='null';}
	else
	{var newact = (newmember.activities[newmember.activities.length-1]).name;}
	
	//console.log("old: ");
	//console.log((oldmember.presence.activities));	
	if (oldmember === undefined || oldmember.activities.length==0)
	{var oldact='null';}
	else
	{var oldact = (oldmember.activities[oldmember.activities.length-1]).name;}
	
	
	console.log("old: "+oldact);
	console.log("new: "+newact);
	
	
	let role = newmember.guild.roles.cache.find(role => role.name === "Currently Playing");
	if(role===undefined)
	{console.log("The role doesn't exist here.\n");
		return;
	}
	
	console.log("RoleID="+role.id+"\n");
	
	
//null, battlerite, Custom Status

	if (oldact!=newact && oldact.indexOf(gameName)!=-1)
	{//public.send(name+" has stopped playing Battlerite");
	newmember.member.roles.remove(role.id);
	}	


	if (oldact!=newact && newact.indexOf(gameName)!=-1)
	{//public.send(name+" has started playing Battlerite");
	newmember.member.roles.add(role.id);
	}


	
	if (oldact==newact && newact.indexOf(gameName)!=-1)
		//if (!newmember.member.roles.has(role.id))
			newmember.member.roles.add(role.id);
	
	});

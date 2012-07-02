var irc = require('irc');
var Parse = require('./Parse.js');

var bot = {
  nick: 'Dunn',
  server: 'irc.freenode.net',
  channels: ['#webtech'],
  admins: ['Killswitch', 'K1llswitch'],
  cmd: '.',
  alias: '?',
  db: {
    parse: {
      api_key: 'wvd7OvFb5chNRif22wrZHZdhWKaXoZ9gSS8lp2NI',
      master_key: 'rqbhP0Xb1Zqed6baa8GW8oGvW37yvLLok3NVtrvv'
    }
  }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var client = new irc.Client(bot.server, bot.nick, {
    channels: bot.channels,
});

var db = new Parse(bot.db.parse.api_key, bot.db.parse.master_key);

client.addListener('message', function (user, channel, message) {
  
  var karma_to, who;
  
  if (user !== bot.nick)
  {
      db.insert('log', { channel: channel, user: user, message: message }, function (err, response) {
      console.log('[' + channel + '] ' + user + ': ' + message);
    });
  }

  if (greet = message.match(/^(hi|hello|greetings|hai|sup|wassup|wussup|what'?s up|hola|howdy|good (evening?|morning?|afternoon)|yo{1,10}) (.*).?/i))
  {
    console.log(greet);
    if (greet[3] === bot.nick.toLowerCase() || greet[3] === bot.nick)
    {
      client.say(channel, greet[1].capitalize() + ' ' + user + '.');
    }
  }
  
  if (mad = message.match(/^(he|u|yu)mad\.(.*)$/i))
  {
    client.say(channel, 'Yep, he mad.');
  }
  
  if (user === 'ztag100' && message.match(/(fuck|shit|piss|ass|whore|skank|pussy|dick|nigger|nigga|bastard|faggot|tits|cunt|cock|slut|cum|jizz|dildo|douche|douche|blowjob|hoe|whore)/i))
  {
    client.say(channel, 'Watch your mouth, ztag100. I have just docked you a point of karma.');
  }
  
  if (message === bot.cmd + 'help')
  {
    client.say(channel, user + ': Currently I log the channel, greet you if you greet me, and issue and revoke karma to users.');
  }
  
  if (message === bot.cmd + 'about')
  {
    client.say(channel, user + ': My name is ' + bot.nick + ' and I am a Node.js powered bot using Node-IRC, written by Killswitch, and I store my data on parse.com.');
  }
  
  if (to = message.match(/^(.*)\+\+;?$/i))
  {
    karma_to = to[1];
    if (karma_to === user)
    {
      client.say(channel, user + ': Since you attempted to give yourself karma, I just took a point away from you.');
    }
    else
    {
      db.insert('karma', { channel: channel, from: user, to: karma_to, action: 'give' }, function (err, response) {
          client.say(channel, user + ': Thank you for giving karma to ' + karma_to + '.');
      });
    }
    
  }
  
  if (to = message.match(/^(.*)\-\-;?$/i))
  {
    karma_to = to[1];
    if (karma_to === user)
    {
      client.say(channel, user + ': Well, since you want to do that, I guess I can\'t stop you. I have just taken a point from you.');
    }
    else
    {
      db.insert('karma', { channel: channel, from: user, to: karma_to, action: 'take' }, function (err, response) {
          client.say(channel, user + ': I\'m sorry to hear ' + karma_to + ' wasn\'t very helpful. We\'ve taken a point away from them.');
      });
    }
    
  }
  
  if (seen = message.match(/^\.seen (.*)$/i))
  {
    who = seen[1];
    if (who === user)
    {
      client.say(channel, user + ': You were last seen just now. :)');
    }
    else if (who === bot.nick)
    {
      client.say(channel, user + ': I am right here.');
    }
    else
    {
      db.findLatest('log', { user: who }, function (err, response) {
        console.log(response);
        if (response.results.length === 0)
        {
          client.say(channel, user + ': I have not seen ' + who + '.');
        }
        else
        {
          client.say(channel, user + ': The last time I seen ' + who + ' was at ' + response.results[0].createdAt + ' saying: <' + who + '> ' + response.results[0].message);
        }
      });
    }
  }
  
  if (message === bot.nick + ' sing to me')
  {
    var song = 'I ain\'t got no time to waste, save a horse just ride my face. Don\'t laugh at me, ' +
               'for real god damnit, I wanna be the filling of a ' + bot.nick +' sandwich. ' +
               'You be the bread and I\'ll bring my meat, and I\'ll slap your butt cheeks until I make a beat.';
    client.say(channel, user + ': ' + song);
  }
  
  if (love = message.match(/<3/i))
  {
    client.action(channel, 'can feel the love.');
  }
  
  if (message === bot.cmd + 'code')
  {
    client.say(channel, 'You can view, and fork my code to contribute on GitHub @ http://www.github.com/joshmanders/dunn');
  }
  
});

client.addListener('join', function (channel, user, message) {
  // client.say(channel, 'Welcome to #webtech, ' + user + '. Enjoy your stay. :)');
});
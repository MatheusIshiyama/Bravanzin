# Bravanzin

## Config inicial

### requisitos:

Instalar o windows build tools

     npm install --global windows-build-tools

### Dependências:

    npm install discord.js // discord
    npm install node-opus // decoder music
    npm install ffmpeg-static // dependência do decoder
    npm install ytdl-core // youtube player
    npm install youtube-playlist // pegar playlist do youtube

## Criar o projeto bot

### Bot discord

Entre no site do [Discord](discordapp.com) e faça login, e vá em developers, e entre em [Developer portal](https://discordapp.com/developers/applications). Após isso, criar uma nova aplicação e dê um nome ao projeto, logo em seguida, entre na aba de "Bot" e crie um bot, lá teremos o token do bot que é essencial para fazermos funcionar.

Para colocar o bot em um servidor Discord, basta pegar o ID do projeto, que fica nas informações gerais do projeto, chamada de CLIENT ID e colar no lugar da variável

     https://discordapp.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=8

     Ex: https://discordapp.com/oauth2/authorize?client_id=16849416418615&scope=bot&permissions=8  // número gerado aleatóriamente

## Iniciando o projeto

Inicie o projeto com o comando pelo cmd em uma pasta vazia e instale as dependências.

** Para navegar entre pastas use o comando cd <nome_da_pasta> **

     npm init -y

Após isso, criar um arquivo .js para iniciar a programação (ex. bot.js)

Feito isso, sua pasta terá os arquivos: package.json, package-lock.json, bot.js

crie um arquivo chamado config.json para armazenarmos a key do bot, abra o arquivo json e digite

```json
{
    "discordToken": "KEY_DISCORD",
    "prefix": "COMAND"
}
```

o KEY_DISCORD é a key que foi gerada antes de iniciarmos o projeto, e o COMAND do prefix é o comando que usaremos para acionar o bot (ex. "!" => {!play, !info})

Agora temos os arquivos config.json, package.json, package-lock.json, bot.js

No arquivo .js vamos configurar as keys

```javascript
const config = require("config.json");
const bot = new Discord.Client();

bot.login(config.discordToken);
```

Com isso, configuramos a key.

No arquivo package.json, na linha ["Main":] coloque na frente o nome do arquivo .js (ex. "Main": bot.js)

## Eventos iniciais do bot

### Console.log quando o bot iniciar

Abra o arquivo .js e faça a requisição do discord.js (a variável <bot>, pode ser trocada para qualquer nome)

```javascript
const bot = new Discord.Client();

bot.on("ready", () +> { //quando o bot iniciar, ele vai fazer...
     console.log(`Bot foi iniciado, com ${bot.users.cache.size} usuários, em ${bot.channels.cache.size} canais, em ${bot.guilds.cache.size} servidores.`);
     bot.user.setPresence( {activity: { name: `twitch.tv/bravanzin para ${bot.users.cache.size} viewers`, type: 1, url: 'https://twitch.tv/bravanzin' }} );
})
```

ele da o console.log das informações de usuários e canais e configura para o bot ficar em modo(type) transmissão, mas você pode alterar o type(0 = jogando; 1 = transmitindo; 2 = Ouvindo; 3 = Assistindo)

### Executar uma função

```javascript
bot.on("message", (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.guild) return;

    // para ler o comando
    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    // executar algum comando
    if (command === "teste") {
        message.channel.send("Testando...");
        message.edit("Funcionando perfeitamente");
    }

    // proximo comando
    else if (command === "beep") {
        message.reply("boop");
    }
});
```

### Exemplo de código

```javascript
const config = require("config.json");
const bot = new Discord.Client();

bot.on("ready", () +> { //quando o bot iniciar, ele vai fazer...
     console.log(`Bot foi iniciado, com ${bot.users.cache.size} usuários, em ${bot.channels.cache.size} canais, em ${bot.guilds.cache.size} servidores.`);
     bot.user.setPresence( {activity: { name: `twitch.tv/bravanzin para ${bot.users.cache.size} viewers`, type: 1, url: 'https://twitch.tv/bravanzin' }} );
});

bot.on("message", message => {
     if(message.author.bot) return;
     if(message.channel.type === 'dm') return;
     if(!message.guild) return;

     // para ler o comando
     const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
     const comand = args.shift().toLowerCase();

     // executar algum comando
     if(comand === "teste") {
          message.channel.send("Testando...");
          message.edit("Funcionando perfeitamente");
     }

     // proximo comando
     else if(comando === "beep") {
          message.reply("boop");
     }
});

```

### Melhorando o código

Para facilitarmos o código e não termos um arquivo muito extenso, iremos criar uma pasta chamada "comandos", onde iremos colocar todos os comandos do bot.

No arquivo principal (ex: bot.js) iremos utilizar o "fs" e adicionar o "Collection" no bot para pegarmos todos os arquivos da pasta e armazenarmos na "Collection" do bot.

```javascript
bot commands = new Discord.Collection();
```

Com o "readdir", colocaremos o caminho da pasta dos arquivos igual o exemplo abaixo e utilizaremos uma arrow function para pegar os arquivos e armazendar no Collection, um por um, o "let commandjs" irá fazer um filtro para pegar o nome do arquivo sem o ".js" (exemplo: play, info).

```javascript
const fs = require('fs');

fs.readdir("./commands/", (err, files) => {
    if (err) {
        console.log(err);
    }
    let commandjs = files.filter((f) => f.split(".").pop() == "js");
    commandjs.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`Comando ${f} carregado com sucesso.`);
        bot.commands.set(props.info.name, props);
    });
});
```

Para criarmos o comando iremos criar um arquivo dentro da pasta "comandos" com o nome do comando + .js, exemplo: play.js, info.js

No arquivo o padrão em todos será:

```javascript
exports.run = async (bot, message) => {
    // codigo do comando
}

exports.info = {
    //informação do comando
     name: "<comando>"
}
```

No arquivo principal iremos fazer o filtro para executar o comando, colocaremos isso dentro do "bot.on("message")"

```javascript
    const commandcmd = bot.commands.get(command);
        if(commandcmd) {
            commandcmd.run(bot, message);
        }
```

Isso fará com que execute o arquivo do comando solicitado.

## Subindo o bot no Heroku

### Config Heroku

Vá no site do [Heroku](heroku.com) e faça login, crie um novo app, assim que carregar tudo, vamos configurar o heroku, vá em settings, esse projeto em específico precisa do windows-build-tools, e para isso precisaremos ter esse link https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git para buildar nosso bot, vá em "Buildpacks" e adicione esse link para conseguirmos buildar nosso bot, adicione também o node.js, em settings também, iremos utilizar de variáveis, procurando por "Config vars", dentro criaremos as variáveis discordToken e o prefix, onde estaremos colocando as mesmas keys que temos no config.json

### Config Bot

No nosso arquivo .js precisaremos adicionar prefixos para o discordToken e o prefix, que seria o "process.env." (ex. process.env.discordToken).
Ex.

```javascript
bot.login(process.env.discordToken);
```

precisaremos criar um arquivo chamado Procfile, para enviar comandos para o heroku e dentro dele terá somente:

```Procfile
worker: node bot.js
```

bot.js é o exemplo que utilizamos, mas tem que ser o nome do seu arquivo .js

precisaremos criar um arquivo chamado .gitignore, no qual selecionaremos quais arquivos não serão enviados para o github, no arquivo teremos:

```gitignore
.gitignore
node-modules/
package-lock.json
config.json
```

Após isso, teremos que configurar o git

### Config Github

No [Github](github.com) faça login e crie um repositório limpo (não precisa adicionar o README.md)
Vá no cmd, entre na pasta do bot, e execute esses comandos, lembre-se de instalar o git para executar esses comandos

```
git init
git add .
git commit -m "subindo projeto para o git"
git remote add origin <link_repositorio>
git push origin master
```

### Linkar github com heroku e ligar o bot

Após configurar tudo, precisaremos linkar o repositório do git com a nossa aplicação no heroku, vá no [heroku](heroku.com) e entre em deploy, selecione Github, conect sua conta do git e selecione o repositório e habilite o automatic deploy, para quando você fizer uma alteração no repositório git, o heroku recompilar o arquivo.

Depois disso tudo, vá em Overview e procure por Configure Dynos, lá ligaremos o worker e desligaremos o web, e assim nosso bot estará online, basta conferir no console log, que fica em "more", no canto superior direito "view logs".

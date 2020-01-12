const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const waconfig = require('../waconfig');
//watson credentials
const version = waconfig.version;
const apikey = waconfig.apikey;
const url = waconfig.url;
const assistantId = waconfig.assistantId;

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('index', {
            title: 'Iniciar Sesión'
        });
    });

    app.post('/waconnection', async (req, res) => {
        const assistant = new AssistantV2({
            version: version,
            authenticator: new IamAuthenticator({
                apikey: apikey,
            }),
            url: url,
        });
        assistant.createSession({
            assistantId: assistantId
        })
            .then(resS => {
                assistant.message({
                    assistantId: assistantId,
                    sessionId: resS.result.session_id,
                    input: {
                        'message_type': 'text',
                        'text': ''
                    }
                })
                    .then(resM => {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ session: resS, message: resM }));
                    })
                    .catch(err => {
                        console.log(err);
                    });

            })
            .catch(err => {
                console.log(err);
            });
    });

    app.post('/wamessage', async (req, res) => {
        var message = req.body.text;
        var session = req.body.SessionID;
        const assistant = new AssistantV2({
            version: version,
            authenticator: new IamAuthenticator({
                apikey: apikey,
            }),
            url: url,
        });
        assistant.message({
            assistantId: assistantId,
            sessionId: session,
            input: {
                'message_type': 'text',
                'text': message
            }
        })
            .then(resM => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(resM));
            })
            .catch(err => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(err));
            });
    });
};
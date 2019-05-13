const os = require('os');
const express = require('express');
const open = require('open');
const QRCode = require('qrcode-svg');

function getIpAddress() {
  const candidates = Object.values(os.networkInterfaces()).filter((v) => {
    const ipv4s = v.filter((iface) => iface.family === 'IPv4' && !iface.internal);
    return ipv4s.length > 0;
  });
  return candidates[0][0].address;
}

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use('/', express.static('src/static'));

app.get('/ip', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(new QRCode(`http://${getIpAddress()}:${port}`).svg());
});

app.post('/send', (req, res) => {
  const { url } = req.body;
  if (url === undefined) {
    // TODO validate URL
    console.error('No url is present');
  } else {
    open(url);
  }
  res.end();
});

app.listen(port, () => {
  const qrLocation = `http://${getIpAddress()}:${port}/qr.html`;
  console.log('A web browser will be opened shortly at', qrLocation);
  open(qrLocation);
});

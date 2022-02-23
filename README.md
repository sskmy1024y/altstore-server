<div align="center">
  <img src="https://user-images.githubusercontent.com/16918590/155378581-397388e6-2f5c-45f4-ae87-564fac508882.png" height="300px" />
  <h1>AltStore Server</h1>
</div>

<div align="center">
<a href="https://github.com/sskmy1024y/altstore-server/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License: MIT"></a>

</div>

<br>

<div align="center">
  <strong>Self hosting original AltStore repository.</strong>

</div>

## ✅ Feature

*   [x] **Self hosting AltStore source repository**
*   [x] **Easy upload and auto generate apps.json**
*   [x] Work on Docker.

## 📦 Requirement

*   Docker environment
*   AltStore 1.5+ (now beta for patron only)

## 💁‍♀️ Usage

1.  Clone this repository
2.  Copy `.env.example` to `.env` and write `ADMIN_NAME` and `ADMIN_PASS`.
3.  Start server
    * Docker 
      ```sh
      $ docker-compose build
      $ docker-compose up -d
      ```
        
    * Node
      ```sh
      $ yarn
      $ yarn build
      $ yarn start
      ```
4.  Open `http://localhost:3000/admin.html` and enter `ADMIN_NAME` and `ADMIN_PASS`.
5.  Upload your ipa file and wait one minutes (generate apps.json).
6.  Open `http://localhost:3000` (or your ip address / domain) on your iPhone.
7.  Press `Add to AltStore`
8.  If you want customize app info, edit to `.cache`  file in `public/assets/{bundleId}/{version}/`


## 🤝 Contributing

1.  Fork it ( <https://github.com/sskmy1024y/altstore-server/fork> )
2.  Create your feature branch (`git checkout -b my-new-feature`)
3.  Commit your changes (`git commit -am 'Add some feature'`)
4.  Push to the branch (`git push origin my-new-feature`)
5.  Create a new Pull Request

## 🎫 Licence

The MIT License (MIT)

*   Copyright (c) 2022 Sho YAMASHITA

## 🖋 Author

*   [sho](https://github.com/sskmy1024y)

# SOFIA [![License](https://img.shields.io/badge/license-MIT-red.svg)](https://github.com/adentes-org/SOFIA/blob/master/LICENSE.md) ![Project Status](http://img.shields.io/badge/status-alpha-red.svg) 
[![GitHub release](https://img.shields.io/github/release/adentes-org/SOFIA.svg)](https://github.com/adentes-org/SOFIA/releases) [![GitHub issues](https://img.shields.io/github/issues/adentes-org/SOFIA.svg)](https://github.com/adentes-org/SOFIA/issues) [![Dependency Status](https://david-dm.org/adentes-org/SOFIA.svg)](https://david-dm.org/adentes-org/SOFIA) [![devDependency Status](https://david-dm.org/adentes-org/SOFIA/dev-status.svg)](https://david-dm.org/adentes-org/SOFIA#info=devDependencies)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/cd8593a9cef1442d958c6b43b9187311)](https://www.codacy.com/app/sapk/SOFIA) [![Travis](https://api.travis-ci.org/adentes-org/SOFIA.svg?branch=master)](https://travis-ci.org/adentes-org/SOFIA)

Suivi Opérationnel des Fiches d'Intervention par Applicatif

#### Pour installer les dépendances
```
npm install
```

Pour iOS, sur OSX:
```
npm install -g ios-sim
npm install -g ios-deploy
```

#### Pour compiler pour toutes les plate-formes
```
gulp build
```

#### En mode développement
```
gulp & npm run start-browser
```

#### En mode web-publié
```
gulp & cd www && python -m SimpleHTTPServer 8080 
#L'application est maintenant disponible sur le port 8080 en http
```
NB: L'application est aussi disponible directement en web-publié dans les dernières versions de la base de donnée

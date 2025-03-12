
const express = require('express');
const AtributosController = require('./controllers/AtributosController');
const ClassesController = require('./controllers/ClassesController');
const RacasController = require('./controllers/RacasController');
const DivindadesController = require('./controllers/DivindadesController');
const PericiasController = require('./controllers/PericiasController');
const OrigensController = require('./controllers/OrigensController');
const PoderesController = require('./controllers/PoderesController');
const HabilidadesController = require('./controllers/HabilidadesController');
const routes = express.Router();

//Atributos
routes.get("/api/atributos", AtributosController.getatributos);
routes.get("/api/atributos/:atributo", AtributosController.getatributosByName);
routes.post("/api/atributos", AtributosController.createAtributo);
routes.patch("/api/atributos/:atributo", AtributosController.updateAtributo);
routes.delete("/api/atributos/:atributo", AtributosController.deleteAtributo);

//Classes
routes.get("/api/classes", ClassesController.getClasses);
routes.get("/api/classes/:classe", ClassesController.getClassesByName);
routes.get("/api/classes/:classe/habilidades", ClassesController.getHabilidadesClasse);
routes.get("/api/classes/:classe/tabela-nivel", ClassesController.getTabelaNivel);
routes.get("/api/classes/:classe/proeficiencias", ClassesController.getProeficienciasClasse);
routes.get("/api/classes/:classe/pericias", ClassesController.getPericiasClasse);

routes.post("/api/classes", ClassesController.createClasse); 
routes.patch("/api/classes/:classe", ClassesController.updateClasse); 
routes.delete("/api/classes/:classe", ClassesController.deleteClasse); 

//Divindades
routes.get("/api/divindades", DivindadesController.getDivindades);
routes.get("/api/divindades/:divindade", DivindadesController.getDivindadesByName);
routes.post("/api/divindades", DivindadesController.createDivindade); 
routes.patch("/api/divindades/:divindade", DivindadesController.updateDivindade); 
routes.delete("/api/divindades/:divindade", DivindadesController.deleteDivindade); 

//Origens
routes.get("/api/origens", OrigensController.getOrigens);
routes.get("/api/origens/:origem", OrigensController.getOrigensByName);
routes.post("/api/origens", OrigensController.createOrigem); 
routes.patch("/api/origens/:origem", OrigensController.updateOrigem); 
routes.delete("/api/origens/:origem", OrigensController.deleteOrigem); 

//Pericias
routes.get("/api/pericias", PericiasController.getPericias);
routes.get("/api/pericias/:pericia", PericiasController.getPericiasByName);
routes.post("/api/pericias", PericiasController.createPericia); 
routes.patch("/api/pericias/:pericia", PericiasController.updatePericia); 
routes.delete("/api/pericias/:pericia", PericiasController.deletePericia); 

//Racas
routes.get("/api/racas", RacasController.getRacas);
routes.get("/api/racas/:raca", RacasController.getRacasByName);
routes.post("/api/racas", RacasController.createRaca); 
routes.patch("/api/racas/:raca", RacasController.updateRaca); 
routes.delete("/api/racas/:raca", RacasController.deleteRaca); 

// Poderes
routes.get("/api/poderes", PoderesController.getPoderes);
routes.get("/api/poderes/grupo", PoderesController.getPoderesByGrupoOnly); 
routes.get("/api/poderes/grupo/:grupo", PoderesController.getPoderesByGrupo);
routes.get("/api/poderes/:poder", PoderesController.getPoderesByName); 
routes.post("/api/poderes", PoderesController.createPoder);
routes.patch("/api/poderes/:poder", PoderesController.updatePoder); 
routes.delete("/api/poderes/:poder", PoderesController.deletePoder);


//habilidades
routes.get("/api/habilidades", HabilidadesController.getHabilidades);
routes.get("/api/habilidades/:habilidade", HabilidadesController.getHabilidadesByName);

module.exports = routes;
const axios = require("axios");
const express = require("express");
const catalystSDK = require("zcatalyst-sdk-node");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const catalyst = catalystSDK.initialize(req);
  res.locals.catalyst = catalyst;
  next();
});

function decodeJWT(token) {
  const decoded = jwt.decode(token);
  return decoded;
}

async function fetchLocais(req, res) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  const fetchedLocais = await zcql
    .executeZCQLQuery(`SELECT * FROM Locais`)
    .then((rows) =>
      rows.map((row) => ({
        id: row.Locais.ROWID,
        Nome: row.Locais.Nome,
        Escritorio: row.Locais.Escritorio,
      }))
    );
  return fetchedLocais;
}

async function fetchLocaisWithEscritorioID(req, res, id_escritorio) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  const fetchedLocais = await zcql
    .executeZCQLQuery(
      `SELECT * FROM Locais WHERE Escritorio = '${id_escritorio}'`
    )
    .then((rows) =>
      rows.map((row) => ({
        id: row.Locais.ROWID,
        Nome: row.Locais.Nome,
        Escritorio: row.Locais.Escritorio,
      }))
    );
  return fetchedLocais;
}

async function fetchComidasWithLocalID(req, res, id_local) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  const fetchedComidas = await zcql
    .executeZCQLQuery(`SELECT * FROM Menu WHERE Local = '${id_local}'`)
    .then((rows) =>
      rows.map((row) => ({
        id: row.Menu.ROWID,
        Nome: row.Menu.Nome,
        Preco: row.Menu.Preco,
        Img: row.Menu.Img,
      }))
    );

  return fetchedComidas;
}

async function fetchEscritorios(req, res) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  const fetchedEscritorios = await zcql
    .executeZCQLQuery(`SELECT * FROM Escritorios`)
    .then((rows) =>
      rows.map((row) => ({
        id: row.Escritorios.ROWID,
        Nome: row.Escritorios.Nome,
      }))
    );
  return fetchedEscritorios;
}

async function fetchUsers(req, res) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  const fetchedUsers = await zcql
    .executeZCQLQuery(`SELECT * FROM Users ORDER BY Profile DESC`)
    .then((rows) =>
      rows.map((row) => ({
        id: row.Users.ROWID,
        Nome: row.Users.Nome,
        Email: row.Users.Email,
        Profile: row.Users.Profile,
      }))
    );
  return fetchedUsers;
}

async function fetchEventos(req, res, todos) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  const fetchedEventos = await zcql
    .executeZCQLQuery(
      `
    SELECT Eventos.ROWID, Eventos.Estado, Eventos.Estafeta, Eventos.Telemovel, Eventos.CriadoPor, Eventos.Data, Eventos.Periodo, Eventos.Estado,
    Locais.Nome, Escritorios.Nome, Users.Nome
    FROM Eventos
    INNER JOIN Locais ON Eventos.Local = Locais.ROWID
    INNER JOIN Users ON Eventos.Estafeta = Users.ROWID
    INNER JOIN Escritorios ON Locais.Escritorio = Escritorios.ROWID
    ${todos === "true" ? "" : "WHERE Eventos.Estado = true"}
    ORDER BY Eventos.Estado DESC
`
    )
    .then((rows) =>
      rows.map((row) => ({
        id: row.Eventos.ROWID,
        Estado: row.Eventos.Estado,
        id_Estafeta: row.Eventos.Estafeta,
        Telemovel: row.Eventos.Telemovel,
        CriadoPor: row.Eventos.CriadoPor,
        Data: row.Eventos.Data,
        Periodo: row.Eventos.Periodo,
        Estado: row.Eventos.Estado,
        LocalNome: row.Locais.Nome,
        Escritorio: row.Escritorios.Nome,
        Estafeta: row.Users.Nome,
      }))
    );
  return fetchedEventos;
}

async function fetchGerirEventos(req, res) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  const fetchedEventos = await zcql
    .executeZCQLQuery(
      `
    SELECT Eventos.ROWID, Eventos.Estado, Eventos.Estafeta, Eventos.Telemovel, Eventos.CriadoPor, Eventos.Data, Eventos.Periodo, 
    Locais.Nome, Escritorios.Nome, Users.Nome
    FROM Eventos
    INNER JOIN Locais ON Eventos.Local = Locais.ROWID
    INNER JOIN Users ON Eventos.Estafeta = Users.ROWID
    INNER JOIN Escritorios ON Locais.Escritorio = Escritorios.ROWID
    ORDER BY Eventos.Estado DESC
`
    )
    .then((rows) =>
      rows.map((row) => ({
        id: row.Eventos.ROWID,
        Estado: row.Eventos.Estado,
        id_Estafeta: row.Eventos.Estafeta,
        Telemovel: row.Eventos.Telemovel,
        CriadoPor: row.Eventos.CriadoPor,
        Data: row.Eventos.Data,
        Periodo: row.Eventos.Periodo,
        LocalNome: row.Locais.Nome,
        Escritorio: row.Escritorios.Nome,
        Estafeta: row.Users.Nome,
      }))
    );
  return fetchedEventos;
}

async function fetchEventoWithId(req, res, EVENTOID) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  const fetchedEvento = await zcql
    .executeZCQLQuery(
      `
    SELECT Eventos.ROWID, Eventos.Estafeta, Eventos.Telemovel, Eventos.CriadoPor, Eventos.Data, Eventos.Estado
    Eventos.Periodo, Locais.Nome, Escritorios.Nome, Users.Nome
    FROM Eventos
    INNER JOIN Locais ON Eventos.Local = Locais.ROWID
    INNER JOIN Users ON Eventos.Estafeta = Users.ROWID
    INNER JOIN Escritorios ON Locais.Escritorio = Escritorios.ROWID
    WHERE Eventos.ROWID = '${EVENTOID}'
`
    )
    .then((rows) =>
      rows.map((row) => ({
        id: row.Eventos.ROWID,
        id_Estafeta: row.Eventos.Estafeta,
        Telemovel: row.Eventos.Telemovel,
        CriadoPor: row.Eventos.CriadoPor,
        Data: row.Eventos.Data,
        Periodo: row.Eventos.Periodo,
        Estado: row.Eventos.Estado,
        LocalNome: row.Locais.Nome,
        Escritorio: row.Escritorios.Nome,
        Estafeta: row.Users.Nome,
      }))
    );
  return fetchedEvento;
}

async function fetchEventosWithUserID(req, res, ROWID) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  const fetchedEventos = await zcql
    .executeZCQLQuery(
      `
    SELECT Eventos.ROWID, Eventos.Estafeta, Eventos.Telemovel, Eventos.CriadoPor, Eventos.Data, Eventos.Periodo, Locais.Nome, Escritorios.Nome, Users.Nome
    FROM Eventos
    INNER JOIN Locais ON Eventos.Local = Locais.ROWID
    INNER JOIN Users ON Eventos.Estafeta = Users.ROWID
    INNER JOIN Escritorios ON Locais.Escritorio = Escritorios.ROWID
    WHERE Eventos.CriadoPor = '${ROWID}' OR Eventos.Estafeta = '${ROWID}'
`
    )
    .then((rows) =>
      rows.map((row) => ({
        id: row.Eventos.ROWID,
        id_Estafeta: row.Eventos.Estafeta,
        Telemovel: row.Eventos.Telemovel,
        CriadoPor: row.Eventos.CriadoPor,
        Data: row.Eventos.Data,
        Periodo: row.Eventos.Periodo,
        LocalNome: row.Locais.Nome,
        Escritorio: row.Escritorios.Nome,
        Estafeta: row.Users.Nome,
      }))
    );
  return fetchedEventos;
}

async function fetchMenu(req, res, ROWID) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const fetchedMenu = await zcql
    .executeZCQLQuery(
      `SELECT Menu.*, Locais.Nome FROM Menu
    INNER JOIN Locais ON Menu.Local = Locais.ROWID
    INNER JOIN Eventos ON Locais.ROWID = Eventos.Local
    WHERE Eventos.ROWID = '${ROWID}'`
    )
    .then((rows) =>
      rows.map((row) => ({
        id: row.Menu.ROWID,
        Nome: row.Menu.Nome,
        Preco: row.Menu.Preco,
        Local: row.Menu.Local,
        Img: row.Menu.Img,
      }))
    );
  return fetchedMenu;
}

async function fetchPedidosGroup(req, res, ROWID) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const fetchedMenu = await zcql
    .executeZCQLQuery(
      `SELECT Pedido_has_Menu.Comida, Menu.Nome, Menu.Preco, Menu.Img, SUM(Pedido_has_Menu.Quantidade) as totalQuantidade, SUM(Pedido_has_Menu.Quantidade * Menu.Preco) as totalCost FROM Pedido_has_Menu
  INNER JOIN Pedidos ON Pedido_has_Menu.Pedido = Pedidos.ROWID
  INNER JOIN Menu ON Pedido_has_Menu.Comida = Menu.ROWID
  WHERE Pedidos.Evento = '${ROWID}'
  GROUP BY Pedido_has_Menu.Comida, Menu.Nome, Menu.Preco, Menu.Img`
    )
    .then((rows) =>
      rows.map((row) => ({
        id_Comida: row.Pedido_has_Menu.Comida,
        Quantidade: row.Pedido_has_Menu.Quantidade,
        Nome: row.Menu.Nome,
        Preco: row.Menu.Preco,
        Img: row.Menu.Img,
        totalQuantidade: row.totalQuantidade,
        totalCost: row.totalCost,
      }))
    );

  return fetchedMenu;
}

async function fetchPedidos(req, res, ROWID) {
  //AGRUPO SO POR NOMES
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const fetchedMenu = await zcql
    .executeZCQLQuery(
      `SELECT Menu.Nome, Menu.Preco, Menu.Img, Pedido_has_Menu.Quantidade, Users.Nome, Users.Email, Pedidos.Estado, Pedidos.ROWID, Pedidos.Codigo, Eventos.Telemovel
      FROM Pedido_has_Menu 
      INNER JOIN Menu ON Pedido_has_Menu.Comida = Menu.ROWID
      INNER JOIN Pedidos ON Pedido_has_Menu.Pedido = Pedidos.ROWID 
      INNER JOIN Eventos ON Pedidos.Evento = Eventos.ROWID
      INNER JOIN Users ON Pedidos.Utilizador = Users.ROWID WHERE Pedidos.Evento = '${ROWID}'`
    )
    .then((rows) => {
      const groupedData = rows.reduce((acc, row) => {
        const id = row.Pedidos.ROWID;
        const user = row.Users.Nome;
        const userEmail = row.Users.Email;
        const estado = row.Pedidos.Estado;
        const codigo = row.Pedidos.Codigo;
        const telemovel = row.Eventos.Telemovel;
        const obj = {
          Comida: row.Menu.Nome,
          Quantidade: row.Pedido_has_Menu.Quantidade,
          Preco: row.Menu.Preco,
          Img: row.Menu.Img,
        };
        if (!acc[user]) {
          acc[user] = {
            id: id,
            Estado: estado,
            Nome: user,
            UserEmail: userEmail,
            Codigo: codigo,
            Telemovel: telemovel,
            Pedido_has_Menu: [],
          };
        }
        acc[user].Pedido_has_Menu.push(obj);
        return acc;
      }, {});

      const result = Object.values(groupedData);
      return result;
    });

  return fetchedMenu;
}

// async function fetchPedidos(req, res, ROWID) { // AGRUPA TODOS
//   const { catalyst } = res.locals;
//   const zcql = catalyst.zcql();
//   const fetchedMenu = await zcql.executeZCQLQuery(
//     `SELECT Menu.Nome, Menu.Preco, Menu.Img, Pedido_has_Menu.Quantidade, Users.Nome
//      FROM Pedido_has_Menu
//      INNER JOIN Menu ON Pedido_has_Menu.Comida = Menu.ROWID
//      INNER JOIN Pedidos ON Pedido_has_Menu.Pedido = Pedidos.ROWID
//      INNER JOIN Users ON Pedidos.Utilizador = Users.ROWID WHERE Pedidos.Evento = '${ROWID}'`
//   );

//   const groupedData = fetchedMenu.reduce((acc, row) => {
//     const user = row.Users.Nome;
//     const existingItem = acc[user]?.find(
//       (item) => item.Comida === row.Menu.Nome
//     );
//     const quantity = parseInt(row.Pedido_has_Menu.Quantidade);

//     if (existingItem) {
//       existingItem.Quantidade += quantity;
//     } else {
//       const newItem = {
//         Comida: row.Menu.Nome,
//         Quantidade: quantity,
//         Preco: row.Menu.Preco,
//         Img: row.Menu.Img,
//       };
//       acc[user] = acc[user] || [];
//       acc[user].push(newItem);
//     }

//     return acc;
//   }, {});

//   const result = Object.entries(groupedData).map(([userName, userItems]) => ({
//     Users: { Nome: userName },
//     Pedido_has_Menu: userItems,
//   }));

//   return result;
// }

async function fetchCarrinho(req, res, ROWID, EVENTO) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const fetchedCarrinho = await zcql
    .executeZCQLQuery(
      `SELECT Carrinhos.Carrinho, Carrinhos.ROWID from Carrinhos
      WHERE Carrinhos.Utilizador = '${ROWID}' AND Carrinhos.Evento = '${EVENTO}'`
    )
    .then((rows) => {
      if (rows.length > 0) {
        return {
          id: rows[0].Carrinhos.ROWID,
          carrinho: rows[0].Carrinhos.Carrinho,
        };
      } else {
        return "vazio";
      }
    });
  return fetchedCarrinho;
}

async function fetchUserTemPedido(req, res, EVENTO, ROWID) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const existePedidosUser = await zcql
    .executeZCQLQuery(
      `SELECT * from Pedidos
      WHERE Pedidos.Evento = '${EVENTO}' AND Pedidos.Utilizador = '${ROWID}'`
    )
    .then((rows) => {
      if (rows.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  return existePedidosUser;
}

async function fetchUserPedido(req, res, EVENTO, ROWID) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const fetchedPedido = await zcql
    .executeZCQLQuery(
      `SELECT Menu.ROWID, Menu.Nome, Menu.Preco, Menu.Img, Pedido_has_Menu.Quantidade, Users.Nome, Pedidos.Estado, Pedidos.ROWID, 
      Pedidos.Review, Pedidos.Codigo, Eventos.Telemovel
      FROM Pedido_has_Menu 
      INNER JOIN Menu ON Pedido_has_Menu.Comida = Menu.ROWID
      INNER JOIN Pedidos ON Pedido_has_Menu.Pedido = Pedidos.ROWID 
      INNER JOIN Users ON Pedidos.Utilizador = Users.ROWID
      INNER JOIN Eventos ON Pedidos.Evento = Eventos.ROWID
      WHERE Pedidos.Evento = '${EVENTO}' AND Pedidos.Utilizador = '${ROWID}'`
    )
    .then((rows) => {
      const groupedData = rows.reduce((acc, row) => {
        const id = row.Pedidos.ROWID;
        const user = row.Users.Nome;
        const estado = row.Pedidos.Estado;
        const codigo = row.Pedidos.Codigo;
        const review = row.Pedidos.Review;
        const telemovel = row.Eventos.Telemovel;
        const obj = {
          id: row.Menu.ROWID,
          Nome: row.Menu.Nome,
          Preco: row.Menu.Preco,
          Local: row.Menu.Local,
          Img: row.Menu.Img,
          quantidade: row.Pedido_has_Menu.Quantidade,
        };
        if (!acc[user]) {
          acc[user] = {
            id: id,
            Estado: estado,
            Nome: user,
            Codigo: codigo,
            Review: review,
            Telemovel: telemovel,
            Pedido_has_Menu: [],
          };
        }
        acc[user].Pedido_has_Menu.push(obj);
        return acc;
      }, {});

      const result = Object.values(groupedData);
      return result[0];
    });

  return fetchedPedido;
}

async function fetchUserPedidos(req, res, ROWID) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const fetchedPedidos = await zcql
    .executeZCQLQuery(
      `SELECT Menu.ROWID, Menu.Nome, Menu.Preco, Menu.Img, Pedido_has_Menu.Quantidade, Users.Nome, Pedidos.Estado, Pedidos.ROWID, Eventos.ROWID
      FROM Pedido_has_Menu 
      INNER JOIN Menu ON Pedido_has_Menu.Comida = Menu.ROWID
      INNER JOIN Pedidos ON Pedido_has_Menu.Pedido = Pedidos.ROWID 
      INNER JOIN Users ON Pedidos.Utilizador = Users.ROWID
      INNER JOIN Eventos ON Pedidos.Evento = Eventos.ROWID
      WHERE Pedidos.Utilizador = '${ROWID}'`
    )
    .then((rows) => {
      const groupedData = rows.reduce((acc, row) => {
        const id = row.Pedidos.ROWID;
        const user = row.Users.Nome;
        const estado = row.Pedidos.Estado;
        const id_evento = row.Eventos.ROWID;
        const obj = {
          id: row.Menu.ROWID,
          Nome: row.Menu.Nome,
          Preco: row.Menu.Preco,
          Local: row.Menu.Local,
          Img: row.Menu.Img,
          quantidade: row.Pedido_has_Menu.Quantidade,
        };
        if (!acc[user]) {
          acc[user] = {
            id: id,
            Estado: estado,
            Nome: user,
            id_evento: id_evento,
            Pedido_has_Menu: [],
          };
        }
        acc[user].Pedido_has_Menu.push(obj);
        return acc;
      }, {});

      const result = Object.values(groupedData);
      return result;
    });

  return fetchedPedidos;
}

async function criarEvento(req, res, novoEvento) {
  const { catalyst } = res.locals;
  const tableEventos = catalyst.datastore().table("Eventos");
  const evento = await tableEventos.insertRow(novoEvento);
  return evento;
}

async function criarPedido(req, res, carrinho, id_evento, id_user, mbwayCode) {
  const { catalyst } = res.locals;
  const tablePedidos = catalyst.datastore().table("Pedidos");
  const tablePedidosHas = catalyst.datastore().table("Pedido_has_Menu");
  const PedidoCriado = await tablePedidos.insertRow({
    Utilizador: id_user,
    Evento: id_evento,
    Estado: "Finalizado",
    Codigo: mbwayCode,
  });
  id_PedidoCriado = PedidoCriado.ROWID;

  await carrinho.map((comida) => {
    const newProdutoHasMenu = {
      Comida: comida.id,
      Quantidade: comida.quantidade,
      Pedido: id_PedidoCriado,
    };
    const pedidoHasMenuCriado = tablePedidosHas.insertRow(newProdutoHasMenu);
  });

  return PedidoCriado;
}

async function criarCarrinho(req, res, carrinho, id_evento, id_user) {
  const { catalyst } = res.locals;
  const tableCarrinhos = catalyst.datastore().table("Carrinhos");

  const carrinhoCriado = await tableCarrinhos.insertRow({
    Utilizador: id_user,
    Evento: id_evento,
    Carrinho: carrinho,
  });
  return carrinhoCriado;
}

async function updateCarrinho(
  req,
  res,
  carrinho,
  id_evento,
  id_user,
  carrinho_id
) {
  const { catalyst } = res.locals;
  const tableCarrinhos = catalyst.datastore().table("Carrinhos");

  const updated = await tableCarrinhos.updateRow({
    ROWID: carrinho_id,
    Carrinho: carrinho,
  });

  return updated;
}

async function updatePedido(req, res, carrinho, updatePedido_id) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const tablePedido_has = catalyst.datastore().table("Pedido_has_Menu");

  const ids_para_eliminar = await zcql
    .executeZCQLQuery(
      `SELECT ROWID FROM Pedido_has_Menu WHERE Pedido = '${updatePedido_id}'`
    )
    .then((rows) =>
      rows.map((row) => ({
        id: row.Pedido_has_Menu.ROWID,
      }))
    );

  //eliminar antigos
  let arrayIds = [];
  const itemsDeleted = await ids_para_eliminar.map((obj) => {
    if (obj) {
      const idPedidoHas = obj.id;
      arrayIds.push(idPedidoHas);
    }
  });

  if (arrayIds.length > 0) {
    var deletePromise = tablePedido_has.deleteRows(arrayIds);
  }

  console.log(arrayIds);

  //inserir novos
  await carrinho.map((comida) => {
    const newProdutoHasMenu = {
      Comida: comida.id,
      Quantidade: comida.quantidade,
      Pedido: updatePedido_id,
    };
    const pedidoHasMenuCriado = tablePedido_has.insertRow(newProdutoHasMenu);
  });

  return itemsDeleted;
}

//updateCargo
async function updateCargo(req, res, id_user, newCargo) {
  const { catalyst } = res.locals;
  const tableUsers = catalyst.datastore().table("Users");
  console.log("newCargo");
  console.log(newCargo);
  const updated = await tableUsers.updateRow({
    ROWID: id_user,
    Profile: newCargo,
  });

  return updated;
}

async function pagarPedido(req, res, id_pedido, estado) {
  const { catalyst } = res.locals;
  const tablePedidos = catalyst.datastore().table("Pedidos");

  const updated = await tablePedidos.updateRow({
    ROWID: id_pedido,
    Estado: estado,
  });

  return updated;
}

async function eliminarPedido(req, res, id_pedido) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const tablePedido_has = catalyst.datastore().table("Pedido_has_Menu");

  //delete pedido Items
  const ids_para_eliminar = await zcql
    .executeZCQLQuery(
      `SELECT ROWID FROM Pedido_has_Menu WHERE Pedido = '${id_pedido}'`
    )
    .then((rows) =>
      rows.map((row) => ({
        id: row.Pedido_has_Menu.ROWID,
      }))
    );

  //eliminar antigos
  let arrayIds = [];
  const itemsDeleted = await ids_para_eliminar.map((obj) => {
    if (obj) {
      const idPedidoHas = obj.id;
      arrayIds.push(idPedidoHas);
    }
  });

  if (arrayIds.length > 0) {
    var deletePromise = tablePedido_has.deleteRows(arrayIds);
  }

  //delete pedido
  const tablePedidos = catalyst.datastore().table("Pedidos");
  const deleted = await tablePedidos.deleteRow(id_pedido);

  return "eliminado";
}

async function sendMessageChannel(mensagem, channel) {
  const refreshUrl =
    "https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.381cb3168f1c4cbc152d9ec6af01a48a.97c82b63c8d26bf02aafec3191ca428c&client_id=1000.FSRADMGYBIIROVLKSEAWJM4HZ68DAW&client_secret=51b09f14a95e96c263f1860d16e6d64807f7f202ea&grant_type=refresh_token";
  const response = await axios.post(refreshUrl);
  const { access_token } = response.data;

  //channel
  const sendMessageURL = `https://cliq.zoho.com/api/v2/channelsbyname/${channel}/message`;
  const messageToChannelResponse = await axios.post(
    sendMessageURL,
    {
      text: mensagem,
    },
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
      },
    }
  );
  return messageToChannelResponse;
}

async function sendMessageChat(mensagem, email) {
  try {
    const response = await axios.get(
      "https://tokens-698969518.development.catalystserverless.com/server/tokengenerator/token/producao"
    );
    const token = response.data.token;

    const sendMessageURL = `https://cliq.zoho.com/api/v2/buddies/${email}/message`;
    const messageToChatResponse = await axios.post(
      sendMessageURL,
      {
        text: mensagem,
      },
      {
        headers: {
          Authorization: token,
          connection_name: "producao",
        },
      }
    );
    return messageToChatResponse;
  } catch {
    return "erro";
  }
}

async function todosEntregues(req, res, id_evento, newEstado) {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();

  //select every pedido from Pedidos where id_evento and Estado = "Pago"
  const paraAtualizar = await zcql
    .executeZCQLQuery(
      `SELECT ROWID FROM Pedidos WHERE Evento = '${id_evento}' AND Estado = 'Pago'`
    )
    .then((rows) =>
      rows.map((row) => ({
        ROWID: row.Pedidos.ROWID,
        Estado: newEstado,
      }))
    );

  let updated = null;
  if (paraAtualizar.length >= 1) {
    const table = catalyst.datastore().table("Pedidos");
    updated = table.updateRows(paraAtualizar);
  }

  return updated;
}

const avaliarEstafeta = async (
  req,
  res,
  user,
  id_estafeta,
  id_evento,
  id_pedido,
  rating,
  observacoes
) => {
  const { catalyst } = res.locals;
  const zcql = catalyst.zcql();
  const tableReviews = catalyst.datastore().table("Reviews");
  const tablePedidos = catalyst.datastore().table("Pedidos");
  const tableUsers = catalyst.datastore().table("Users");

  const existe = await zcql
    .executeZCQLQuery(
      `SELECT ROWID FROM Reviews WHERE Utilizador = '${user}' AND Pedido = '${id_pedido}' AND Pedido = '${id_pedido}' AND Evento = '${id_evento}'`
    )
    .then((rows) =>
      rows.map((row) => ({
        ROWID: row.Reviews.ROWID,
      }))
    );

  if (existe.length > 0) {
    return "ja avaliou";
  }

  const newReview = await tableReviews.insertRow({
    Utilizador: user,
    Estafeta: id_estafeta,
    Evento: id_evento,
    Pedido: id_pedido,
    Rating: rating,
    Observacoes: observacoes,
  });

  const review_id = newReview.ROWID;
  //foreign key in Pedidos

  const updatedPedido = await tablePedidos.updateRow({
    ROWID: id_pedido,
    Review: review_id,
  });

  //update Estafeta Rating
  const estafeta = await tableUsers.getRow(id_estafeta);
  console.log(estafeta);
  const estafetaRating = estafeta.Rating ? estafeta.Rating : 1;
  const estafetaNumReviews = estafeta.NumReviews ? estafeta.NumReviews : 0;
  const newEstafetaRating = Math.ceil(
    (parseFloat(estafetaRating) * parseInt(estafetaNumReviews) +
      parseInt(rating)) /
      (parseInt(estafetaNumReviews) + 1)
  );
  console.log(newEstafetaRating);
  const updatedEstafeta = await tableUsers.updateRow({
    ROWID: id_estafeta,
    Rating: newEstafetaRating,
    NumReviews: parseInt(estafetaNumReviews) + 1,
  });
  return review_id;
};

const updateEvento = async (req, res, id_evento, newEstado) => {
  const { catalyst } = res.locals;
  const tableEventos = catalyst.datastore().table("Eventos");
  const updated = await tableEventos.updateRow({
    ROWID: id_evento,
    Estado: newEstado,
  });
  return updated;
};

app.get("/", (req, res) => {});
//     const code = req.query.code;
//     const client_id = "1000.4ZQU4EDHO9KT92ZLM9Y71VBARLBZNA";
//     const client_secret = "23122f81bb2d4c768897e2db0d4c5a783e48abf2a2";
//     const redirect = "http://localhost:3000/server/xavier_eats_function/login";
//     const url = `https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect}&code=${code}`;

//     //get token
//     const response = await axios.post(url);
//     const token = decodeJWT(response.data.id_token);
//     const access_token = response.data.access_token;
//     const user_email = token.email;

//     //get user data
//     const userInfoURL = `https://accounts.zoho.com/oauth/user/info`;
//     const responta = await axios.get(userInfoURL, {
//       headers: {
//         Authorization: `Zoho-oauthtoken ${access_token}`,
//       },
//     });
//     const user_nome = responta.data.Display_Name;
//     // respota = {
//     //   First_Name: "Manuel",
//     //   Email: "user7@demo7.loba.pt",
//     //   Last_Name: "Silva",
//     //   Display_Name: "Manuel Silva",
//     //   ZUID: 716124001,
//     // };

//     //verificar se já existe
//     const { catalyst } = res.locals;
//     const zcql = catalyst.zcql();

//     const fetchUser = await zcql
//       .executeZCQLQuery(`SELECT * FROM Users WHERE Email = '${user_email}'`)
//       .then((rows) =>
//         rows.map((row) => ({
//           id: row.Users.ROWID,
//           email: row.Users.Email,
//           nome: row.Users.Nome,
//         }))
//       );

//     if (fetchUser.length === 0) {
//       const tableUsers = catalyst.datastore().table("Users");

//       //fetchUser nao da
//       const { ROWID: id } = await tableUsers.insertRow({
//         Email: user_email,
//         Nome: user_nome,
//       });
//     }

//     res.status(200).send({
//       status: "success",
//       data: "succ",
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       status: "failure",
//       message: "We're unable to process the request.",
//     });
//   }
// });

app.post("/login", async (req, res) => {
  try {
    const { code, redirectAvaliar } = req.body;

    const client_id = "1000.4ZQU4EDHO9KT92ZLM9Y71VBARLBZNA";
    const client_secret = "23122f81bb2d4c768897e2db0d4c5a783e48abf2a2";
    const redirect = "http://localhost:3000/app";
    // const redirect = "https://xavier-eats-717255921.development.catalystserverless.com/app/index.html";
    const url = `https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect}&code=${code}`;

    //get token
    const response = await axios.post(url);
    console.log(response);
    const token = decodeJWT(response.data.id_token);
    const access_token = response.data.access_token;
    const user_email = token.email;

    //get user data
    const userInfoURL = `https://accounts.zoho.com/oauth/user/info`;
    const responta = await axios.get(userInfoURL, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
      },
    });
    const user_nome = responta.data.Display_Name;
    //verificar se já existe
    const { catalyst } = res.locals;
    const zcql = catalyst.zcql();

    let fetchUser = await zcql
      .executeZCQLQuery(`SELECT * FROM Users WHERE Email = '${user_email}'`)
      .then((rows) =>
        rows.map((row) => ({
          ROWID: row.Users.ROWID,
          Email: row.Users.Email,
          Nome: row.Users.Nome,
          Profile: row.Users.Profile,
        }))
      );
    console.log(fetchUser);
    if (fetchUser.length === 0) {
      const tableUsers = catalyst.datastore().table("Users");

      //fetchUser nao da
      fetchUser = await tableUsers.insertRow({
        Email: user_email,
        Nome: user_nome,
        Profile: 1105000000084730, //read
      });
    } else {
      fetchUser = fetchUser[0];
    }

    res.status(200).send({
      status: "success",
      data: {
        isLogged: true,
        fetchUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request.",
    });
  }
});

app.get("/data-criar-evento", async (req, res) => {
  try {
    const { catalyst } = res.locals;
    const zcql = catalyst.zcql();

    const locais = await fetchLocais(req, res);
    const escritorios = await fetchEscritorios(req, res);
    const users = await fetchUsers(req, res);

    res.status(200).send({
      status: "success",
      data: {
        locais,
        escritorios,
        users,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-evento/:EVENTOID", async (req, res) => {
  try {
    const { EVENTOID } = req.params;
    const evento = await fetchEventoWithId(req, res, EVENTOID);
    res.status(200).send({
      status: "success",
      data: {
        evento,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-eventos/:TODOS", async (req, res) => {
  try {
    const { TODOS } = req.params;
    const eventos = await fetchEventos(req, res, TODOS);
    res.status(200).send({
      status: "success",
      data: {
        eventos,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-gerir-eventos", async (req, res) => {
  try {
    const eventos = await fetchGerirEventos(req, res);
    res.status(200).send({
      status: "success",
      data: {
        eventos,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-menu/:ROWID", async (req, res) => {
  try {
    const { ROWID } = req.params;
    const comidasFetch = await fetchMenu(req, res, ROWID);

    res.status(200).send({
      status: "success",
      data: {
        comidasFetch,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-pedidos/:ROWID", async (req, res) => {
  try {
    const { ROWID } = req.params; // id evento
    const pedidosGroupFetch = await fetchPedidosGroup(req, res, ROWID);
    const pedidosFetch = await fetchPedidos(req, res, ROWID);

    res.status(200).send({
      status: "success",
      data: {
        pedidosGroupFetch,
        pedidosFetch,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-carrinho/:EVENTO/:ROWID", async (req, res) => {
  try {
    const { EVENTO, ROWID } = req.params;
    const carrinhoFetch = await fetchCarrinho(req, res, ROWID, EVENTO);
    const carrinhoItems = carrinhoFetch.carrinho;

    res.status(200).json({
      status: "success",
      data: {
        carrinhoFetch,
        carrinhoItems,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-user-tem-pedido/:EVENTO/:ROWID", async (req, res) => {
  try {
    const { EVENTO, ROWID } = req.params;
    const existe = await fetchUserTemPedido(req, res, EVENTO, ROWID);
    console.log(existe);
    res.status(200).send({
      status: "success",
      data: {
        existe,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-user-pedido/:EVENTO/:ROWID", async (req, res) => {
  try {
    const { EVENTO, ROWID } = req.params;
    const fetchedPedido = await fetchUserPedido(req, res, EVENTO, ROWID);
    console.log(fetchedPedido);
    res.status(200).send({
      status: "success",
      data: {
        fetchedPedido,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-user-review/:PEDIDO", async (req, res) => {
  try {
    const { PEDIDO } = req.params;

    const fetchedReview = await fetchUserReview(req, res, PEDIDO);
    console.log(fetchedReview);
    res.status(200).send({
      status: "success",
      data: {
        fetchedReview,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-user-pedidos/:ROWID", async (req, res) => {
  try {
    const { ROWID } = req.params;

    const fetchedPedidos = await fetchUserPedidos(req, res, ROWID);
    console.log(fetchedPedidos);
    res.status(200).send({
      status: "success",
      data: {
        fetchedPedidos,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-cargos-users", async (req, res) => {
  try {
    const { catalyst } = res.locals;
    const zcql = catalyst.zcql();

    const fetchedUsers = await fetchUsers(req, res);
    console.log(fetchedUsers);
    res.status(200).send({
      status: "success",
      data: {
        fetchedUsers,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-gerirlocais-escritorios", async (req, res) => {
  try {
    const escritorios = await fetchEscritorios(req, res);
    console.log(escritorios);

    res.status(200).send({
      status: "success",
      data: {
        escritorios,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-gerirlocais-locais/:ROWID", async (req, res) => {
  try {
    //get params escritorio
    const { ROWID } = req.params;

    const fetchedLocais = await fetchLocaisWithEscritorioID(req, res, ROWID);

    res.status(200).send({
      status: "success",
      data: {
        fetchedLocais,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-gerirlocais-comidas/:ROWID", async (req, res) => {
  try {
    //get params escritorio
    const { ROWID } = req.params; // id local

    const fetchedComidas = await fetchComidasWithLocalID(req, res, ROWID);

    res.status(200).send({
      status: "success",
      data: {
        fetchedComidas,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-verificar-codigo/:CODE", async (req, res) => {
  try {
    const { catalyst } = res.locals;
    const zcql = catalyst.zcql();
    //get params escritorio
    const { CODE } = req.params; // codigo
    console.log(CODE);
    let fetchCodes = await zcql
      .executeZCQLQuery(
        `SELECT Pedidos.Codigo FROM Pedidos WHERE Codigo = '${CODE}'`
      )
      .then((rows) =>
        rows.map((row) => ({
          codigo: row.Pedidos.Codigo,
        }))
      );
    const existeCodigo = fetchCodes.length === 0 ? false : true;
    res.status(200).send({
      status: "success",
      data: {
        existeCodigo,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-pedidos-user/:USER", async (req, res) => {
  try {
    const { catalyst } = res.locals;
    const zcql = catalyst.zcql();

    const { USER } = req.params;

    const fetchPedidos = await zcql
      .executeZCQLQuery(
        `SELECT Pedidos.ROWID, Pedidos.Evento, Pedidos.Estado, Pedidos.Review FROM Pedidos 
        WHERE Utilizador = '${USER}'`
      )
      .then((rows) =>
        rows.map((row) => ({
          ROWID: row.Pedidos.ROWID,
          Evento: row.Pedidos.Evento,
          Estado: row.Pedidos.Estado,
          Review: row.Pedidos.Review,
        }))
      );

    console.log(fetchPedidos);

    res.status(200).send({
      status: "success",
      data: {
        fetchPedidos,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.get("/data-user/:USER", async (req, res) => {
  try {
    const { catalyst } = res.locals;
    const zcql = catalyst.zcql();

    const { USER } = req.params;

    const fetchUser = await zcql
      .executeZCQLQuery(
        `SELECT * FROM Users
        WHERE ROWID = '${USER}'`
      )
      .then((rows) =>
        rows.map((row) => ({
          ROWID: row.Users.ROWID,
          Rating: row.Users.Rating,
        }))
      );

    res.status(200).send({
      status: "success",
      data: {
        fetchUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/criar-evento", async (req, res) => {
  try {
    const { date, periodo, local, estafeta, telemovel, AuthUser_ID } = req.body;

    const newEstafeta = estafeta ? estafeta : AuthUser_ID;

    const novoEvento = {
      Data: date,
      Periodo: periodo,
      Local: local,
      Estafeta: newEstafeta,
      Telemovel: telemovel,
      CriadoPor: AuthUser_ID,
    };
    const evento = await criarEvento(req, res, novoEvento);

    res.status(200).send({
      status: "success",
      data: {
        evento,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/criar-pedido", async (req, res) => {
  try {
    const {
      carrinho,
      id_evento,
      id_user,
      updatePedido_id,
      id_rascunho,
      mbway,
      code,
    } = req.body;

    const mbwayCode = mbway ? code : null;

    if (id_rascunho !== null) {
      const { catalyst } = res.locals;
      const zcql = catalyst.zcql();
      const tableCarrinhos = catalyst.datastore().table("Carrinhos");
      const deleted = await tableCarrinhos.deleteRow(id_rascunho);
    }

    let newPedido;

    if (updatePedido_id == null) {
      console.log("criar novo");
      newPedido = await criarPedido(
        req,
        res,
        carrinho,
        id_evento,
        id_user,
        mbwayCode
      );
    } else {
      console.log("atualizar");
      newPedido = await updatePedido(req, res, carrinho, updatePedido_id);
    }
    console.log(newPedido);
    res.status(200).send({
      status: "success",
      data: {
        newPedido,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/criar-escritorio", async (req, res) => {
  try {
    const { escritorio } = req.body;
    const { catalyst } = res.locals;

    const tableEscritorios = catalyst.datastore().table("Escritorios");
    const escritorioCriado = await tableEscritorios.insertRow({
      Nome: escritorio,
    });
    escritorioCriado.id = escritorioCriado.ROWID;
    res.status(200).send({
      status: "success",
      data: {
        escritorioCriado,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/criar-local", async (req, res) => {
  try {
    const { selected_escritorio, local } = req.body;
    const { catalyst } = res.locals;

    const tableLocais = catalyst.datastore().table("Locais");
    const localCriado = await tableLocais.insertRow({
      Nome: local,
      Escritorio: selected_escritorio,
    });
    localCriado.id = localCriado.ROWID;
    res.status(200).send({
      status: "success",
      data: {
        localCriado,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/criar-comida", async (req, res) => {
  try {
    const { selected_local, comida, preco, imagem } = req.body;
    const { catalyst } = res.locals;
    const tableMenu = catalyst.datastore().table("Menu");
    const comidaCriada = await tableMenu.insertRow({
      Local: selected_local,
      Nome: comida,
      Preco: preco,
      Img: imagem,
    });

    comidaCriada.id = comidaCriada.ROWID;
    res.status(200).send({
      status: "success",
      data: {
        comidaCriada,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/edit-comida", async (req, res) => {
  try {
    const { idComida, nomeComida, precoComida, newImage } = req.body;
    const { catalyst } = res.locals;

    const tableMenu = catalyst.datastore().table("Menu");
    const comidaUpdated = await tableMenu.updateRow({
      ROWID: idComida,
      Nome: nomeComida,
      Preco: precoComida,
      Img: newImage,
    });
    console.log(comidaUpdated);
    comidaUpdated.id = comidaUpdated.ROWID;
    res.status(200).send({
      status: "success",
      data: {
        comidaUpdated,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});
app.post("/update-carrinho", async (req, res) => {
  try {
    const { carrinho, id_evento, id_user } = req.body;
    const carrinhoFetch = await fetchCarrinho(req, res, id_user, id_evento);
    let newCarrinho = null;
    if (carrinhoFetch === "vazio") {
      console.log("foi vazio");
      newCarrinho = await criarCarrinho(req, res, carrinho, id_evento, id_user);
    } else {
      console.log("foi nao vazio");
      const carrinho_id = carrinhoFetch.id;
      newCarrinho = await updateCarrinho(
        req,
        res,
        carrinho,
        id_evento,
        id_user,
        carrinho_id
      );
    }

    console.log(newCarrinho);
    res.status(200).send({
      status: "success",
      data: {
        newCarrinho,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/update-cargo", async (req, res) => {
  try {
    const { idSelectedUser, cargo } = req.body;
    //read ? write : read
    let newCargo =
      cargo == "1105000000084730" ? "1105000000084733" : "1105000000084730";

    const updatedUser = await updateCargo(req, res, idSelectedUser, newCargo);
    updatedUser.id = updatedUser.ROWID;

    res.status(200).send({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/pedido-entregar", async (req, res) => {
  try {
    const { id_pedido, estadoPedido } = req.body;

    const updatedPedido = await pagarPedido(req, res, id_pedido, estadoPedido);
    console.log(updatedPedido);
    res.status(200).send({
      status: "success",
      data: {
        updatedPedido,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/todos-entregues", async (req, res) => {
  try {
    const { id_evento } = req.body;

    //every Pedido in id_Evento where Pedido.Estado = "Pago", Update to "Entregue"
    const updatedPedidos = await todosEntregues(
      req,
      res,
      id_evento,
      "Entregue"
    );

    res.status(200).send({
      status: "success",
      data: {
        updatedPedidos,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/acabar-evento", async (req, res) => {
  try {
    const { id_evento } = req.body;

    //update evento estado to Inativo
    const updatedEvento = await updateEvento(req, res, id_evento, false);

    res.status(200).send({
      status: "success",
      data: {
        updatedEvento,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/delete-pedido", async (req, res) => {
  try {
    const { id_pedido } = req.body;
    const eliminado = await eliminarPedido(req, res, id_pedido);
    console.log(eliminado);
    res.status(200).send({
      status: "success",
      data: {
        eliminado,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.delete("/delete-evento/:ROWID", async (req, res) => {
  try {
    const { ROWID } = req.params;
    const { catalyst } = res.locals;
    const tableEventos = catalyst.datastore().table("Eventos");

    await tableEventos.deleteRow(ROWID);

    res.status(200).send({
      status: "success",
      data: {
        deletedEvento: {
          id: ROWID,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request.",
    });
  }
});

app.delete("/delete-comida/:ROWID", async (req, res) => {
  try {
    const { ROWID } = req.params;
    const { catalyst } = res.locals;
    const tableMenu = catalyst.datastore().table("Menu");

    await tableMenu.deleteRow(ROWID);

    res.status(200).send({
      status: "success",
      data: {
        deletedComida: {
          id: ROWID,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request.",
    });
  }
});

app.delete("/delete-escritorio/:ROWID", async (req, res) => {
  try {
    const { ROWID } = req.params;
    const { catalyst } = res.locals;
    const tableEscritorios = catalyst.datastore().table("Escritorios");

    await tableEscritorios.deleteRow(ROWID);

    res.status(200).send({
      status: "success",
      data: {
        deletedEscritoio: {
          id: ROWID,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request.",
    });
  }
});

app.delete("/delete-local/:ROWID", async (req, res) => {
  try {
    const { ROWID } = req.params;
    const { catalyst } = res.locals;
    const tableLocais = catalyst.datastore().table("Locais");

    await tableLocais.deleteRow(ROWID);

    res.status(200).send({
      status: "success",
      data: {
        deletedLocal: {
          id: ROWID,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request.",
    });
  }
});

//avaliar-estafeta
app.post("/avaliar-estafeta", async (req, res) => {
  try {
    const { user, id_estafeta, id_evento, id_pedido, rating, observacoes } =
      req.body;

    const avaliado = await avaliarEstafeta(
      req,
      res,
      user,
      id_estafeta,
      id_evento,
      id_pedido,
      rating,
      observacoes
    );

    res.status(200).send({
      status: "success",
      data: {
        avaliado,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/endpoint-flexilobar", async (req, res) => {
  try {
    const { formattedDate, email_user } = req.body;

    const response = await axios.get(
      `https://sgp.loba.pt/planeamento_endpoint.php?email=${email_user}&data=${formattedDate}&token=faaa77a4f8f7087f86fbed77a9ed0c76`
    );
    const planeamento = response.data;

    res.status(200).send({
      status: "success",
      data: {
        planeamento,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

app.post("/send-message", async (req, res) => {
  try {
    const { mensagem, channel, email } = req.body;
    const sendMessage = channel
      ? await sendMessageChannel(mensagem, channel)
      : await sendMessageChat(mensagem, email);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request. .|.",
    });
  }
});

module.exports = app;

//how to create SESSION in Node js
//how to access this variable in the front end REACTJS

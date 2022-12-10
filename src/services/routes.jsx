import socket from "../socket/socket";
import Axios from "axios";

const baseUrl = "https://server-who-is-this-pokmeon.onrender.com/v1";
//const baseUrl = "http://localhost:5052/v1";

export async function getServer() {
  try {
    const response = await Axios({
      url: `${baseUrl}/server`,
      method: "GET",
    });

    return response;
  } catch (e) {
    console.log(e);
  }
}

export async function getServerName(name) {
  try {
    const response = await Axios({
      url: `${baseUrl}/serverName`,
      method: "GET",
      params: {
        name: name,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
}

export async function updateCountMembers(id, nomMember, nameMember) {
    try {
      const response = await Axios({
        url: `${baseUrl}/serverUpdate`,
        method: "PUT",
        params: {
          id: id,
          members: nomMember,
          nameMember: nameMember
        },
      });
      return response;
    } catch (e) {
      console.log(e);
    }
}

export async function updateNameServer (name) {
    try {
      const response = await Axios({
        url: `${baseUrl}/serverUpdate`,
        method: "PUT",
        params: {
          id: id,
          name: name
        },
      });
      return response;
    } catch (e) {
      console.log(e);
    }
}

export async function deleteServer(name) {
  try {
    const response = await Axios({
      url: `${baseUrl}/serverDelete`,
      method: "DELETE",
      params: {
        name: name
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
}

export async function saveServer(productData) {
  try {
    const response = await Axios({
      url: `${baseUrl}/server`,
      method: "POST",
      params: {
        name: productData.dataServer.nameServer,
        generations: productData.dataServer.generations,
        creatorId: socket.id,
        countMembers: productData.member,
        namesMembers: productData.namesMembers
      },
    });

    return response;
  } catch (e) {
    console.log(e);
  }
}

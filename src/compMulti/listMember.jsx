import socket from "../socket/socket";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, createRef } from "react";
import { DATA_SERVER, DELETE_DATA_SERVER } from "../reducers/crudReducer";
import { useNavigate } from "react-router-dom";

const listMember = () => {
  const { dbPokemon1, dbPokemonSelect, dataServer, showMenu } = useSelector(
      (state) => state.crud
    ),
    dispatch = useDispatch();

  return (
    <div id="listMember">
      {dataServer.countMembers === 1 ? (
        <div>
          <div>
            <div>
                <h1>{dataServer.nameAdmin}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>
        </div>
      ) : dataServer.countMembers === 2 ? (
        <div>
          <div>
          <div>
                <h1>{dataServer.nameAdmin}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>
          <div>
          <div>
                <h1>{dataServer.nameMember1}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>
        </div>
      ) : dataServer.countMembers === 3 ? (
        <div>
          <div>
          <div>
                <h1>{dataServer.nameAdmin}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>
          <div>
          <div>
                <h1>{dataServer.nameMember1}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>
          <div>
          <div>
                <h1>{dataServer.nameMember2}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div>
          <div>
                <h1>{dataServer.nameAdmin}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>
          <div>
          <div>
                <h1>{dataServer.nameMember1}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>
          <div>
          <div>
                <h1>{dataServer.nameMember2}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>

          <div>
          <div>
                <h1>{dataServer.nameMember3}</h1> 
            </div>
            <div> 
                <button>
                 X
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default listMember;

import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { STORAGE_KEYS } from "../config/storage-keys.config";
import { Cart } from "../models/cart";

@Injectable()
export class StorageService {

    getLocalUser() : LocalUser {
        let user = localStorage.getItem(STORAGE_KEYS.localUser);
        //se localStorage estiver nulo continua setando como nulo
        if (user == null) {
            return null;
        }
        else {
            //localStorage armazena string, 
            //para parear o LocalUser objeto criado é necessário parsea-lo como Json
            return JSON.parse(user);
        }
    }

    setLocalUser(obj: LocalUser) {
        //se obj estiver nulo removê-lo
        if (obj == null) {
            localStorage.removeItem(STORAGE_KEYS.localUser);
        }
        else {
            //se obj estiver preenchido transformar este obj vindo como Json em string
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
        }
    }

    getCart() : Cart {
        let str = localStorage.getItem(STORAGE_KEYS.cart);
        //se localStorage estiver nulo continua setando como nulo
        if (str == null) {
            return null;
        }
        else {
            //localStorage armazena string, 
            //para parear o LocalUser objeto criado é necessário parsea-lo como Json
            return JSON.parse(str);
        }
    }

    setCart(obj: Cart) {
        //se obj estiver nulo removê-lo
        if (obj == null) {
            localStorage.removeItem(STORAGE_KEYS.cart);
        }
        else {
            //se obj estiver preenchido transformar este obj vindo como Json em string
            localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(obj));
        }
    }
}
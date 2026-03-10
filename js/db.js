const dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open("tripsDB", 1);
    request.onupgradeneeded = (e) => {
        const db = e.target.result;
        db.createObjectStore("trips", {
            keyPath: "id",
            autoIncrement: true
        });
    }
    request.onsuccess = () => {
        resolve(request.result);
    }
    request.onerror = () => {
        reject(request.error);
    }
})

async function putData(store, data) {
  return new Promise((resolve, reject) => {
    const req = store.put(data);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}


export const saveTrip = async (objectName, data) => {
    const db = await dbPromise;
    const tx = db.transaction(objectName, "readwrite");
    const store = tx.objectStore(objectName);
    const id = await putData(store, data);
    await tx.complete;
    data.id = id
    return data
}



export const getTrip = async (objectName, id) => {
    const db = await dbPromise;
    return new Promise((resolve) => {
         const tx = db.transaction(objectName, "readonly");
         const store = tx.objectStore(objectName);
         const request = store.get(id);

         
         request.onsuccess = () => {
            resolve(request.result);
         };
    }); 

}

export const getAll = async (objectName) => {
    const db = await dbPromise;
    return new Promise((resolve) => {
         const tx = db.transaction(objectName, "readonly");
         const store = tx.objectStore(objectName);
         const request = store.getAll();

         request.onsuccess = () => {
            resolve(request.result);
         };
    });
}

export const deleteTrip = async (objectName, id) => {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        const tx = db.transaction(objectName, "readwrite");
        const store = tx.objectStore(objectName);
        const request = store.delete(id);
         
        request.onsuccess = () => {
            resolve(true);
        };
        request.onerror = () => {
            reject(request.error);
        };

    }); 
}
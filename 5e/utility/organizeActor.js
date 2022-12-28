/**
 * This macro will organize all actors in your game by create type, then by CR rating
 **/

let folderIds = {};
const keys = Object.keys(CONFIG.DND5E.creatureTypes);

// Create a folder for each creature type
for (const key of keys) {
  try { folderIds[key] = await getFolderId(key); } 
  catch (error) {
    console.error(`Error creating folder for creature type ${key}: ${error}`);
    continue;
  }
}

let crFolderMap = {};
// Create a folder for each CR
for (const actor of game.actors) {
  const type = actor.system.details.type?.value;
  const name = `${type} CR ${actor.system.details.cr}`;
  if (!type || !folderIds[type] || !actor.system.details.cr)
    continue;

  try {
    if (crFolderMap?.[name] === undefined)
        crFolderMap[name] = await getFolderId(type, name);
    
    await actor.update({ folder: crFolderMap[name] });
  } catch (error) {
    console.error(`Error creating folder for creature type ${type}: ${error}`);
    continue;
  }
}

async function getFolderId(main, sub = null) {
  const mainFolder = game.folders.getName(main) ?? await Folder.create({name: main, type: "Actor"});
  if (!sub) return mainFolder.id;

  const subFolder = mainFolder.children.find(f => f.folder.name === sub)?.folder ?? await Folder.create({name: sub, type: "Actor", folder: mainFolder.id});
  return subFolder.id;
}

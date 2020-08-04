export interface IFile {
  fid: number,
  guid: string,
  user: number, //post_author
  date: number, //post_date
  mime: string, //post_mime_type
  filename: string ,//post_name
  status: number, //post_status 0: deleted, 1: publised
  title: string, //post_title
  storage_type: string, //eg, s3, local, server, blockchain
  size: number,
  image?: any,
  styles?: any, //various styles of images 
  file_obj?: any, //Store the file
  src_url?: string, //like blob url or http url, used to display inside admin end. 
  hash?: string, //hash of dataurl of the file
}


export interface ITheme {
  title: string,
  machine_name: string, //This should be unique machine name
  version: string,
  core: string, //Core Version

  thumbnail?: string, //either URL or DataURL
  screenshots?: [], //List of URLs or dataurl as screeshots
  preview?: string, //Preview link
  author_name?: string,
  author_link?: string,
  description?: string,
  requirements?: any, //Like dependencies, browsers etc
  settings?: any, //Theme settings form definitions
  locations?: any, //List of menu location 
  widgets?: any, //List of widgets exported by this theme,
  regions?: any, // List of regions where widgents can sit
  default_settings?: any, //Default settings if any, example default widgets etc
  extra_data?: any, // extra data if any 
  tags?: any,
}

export interface IWidget {
  title: string,
  machine_name: string, //This should be unique machine name
  description?: string, 
  inputs?: any,
  settings?: any, //Form definitions
  weight?: number,
  comp_name?: any,
  comp_path?: any,
}

export interface IRegion {
  title: string,
  machine_name: string, //This should be unique machine name
  description?: string, 
  weight?: number,
}  

export interface IWidRegMap{ 
  widget: IWidget,
  region: IRegion,
  weight?: number,
  title?: string,
  settings?: any,
  status?: number, //weather this is enabled or disabled
}

export interface IMenuItem {
  title: string,
  id: number,
  link?: string,
  weight?: number,
  parent?: number,
  entity_type?: string,
  entity_id?: string,
  target?: string,
  attributes?: any, 
  description?: any,
}

export interface IMenu {
  title: string,
  name: string, //unique machine name
  description?: string,
  items?: IMenuItem[], 
}


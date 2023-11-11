declare type IconOption = "fa-wand-sparkles" | "fa-dove" | "fa-shield" | "fa-leaf" | "fa-fist" | "fa-person" | "fa-house" | "fa-dog"

declare interface DB {
    [username: string]: UserInfo
}

declare interface Sound {
    id: string
    name: string
    filename: string
    url: string
    color: string
}

declare interface Board {
    id: string
    title: string
    icon: IconOption
    sounds: Sound[]
}

declare interface UserInfo {
    boards: Board[]
}
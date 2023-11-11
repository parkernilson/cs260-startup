declare type IconOption = "fa-wand-sparkles" | "fa-dove" | "fa-shield" | "fa-leaf" | "fa-fist" | "fa-person" | "fa-house" | "fa-dog"

declare interface Sound {
    url: string
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
export interface IMessage {
    direction?: number,
    playerName?: string,
    colorName?: string,
    serverComunication?: string,
    player_r?: number,
    playerCoord?: ICoord
}

export interface ICoord {
    x: number,
    y: number

}
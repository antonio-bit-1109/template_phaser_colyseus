import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

export class StyleManager {


    public returnBasicConfigurationStyle(
        color?: string,
        fontsize?: number,
        strokeThickness?: number,
        letterSpacing?: number,
        stroke?: number
    ) {
        return {
            color: color ? color : "black",
            fontSize: fontsize ? fontsize : 40,
            strokeThickness: strokeThickness ? strokeThickness : 5,
            letterSpacing: letterSpacing ? letterSpacing : 2,
            stroke: stroke ? stroke : 10
        } as TextStyle
    }
}
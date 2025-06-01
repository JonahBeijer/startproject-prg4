import { ImageSource, Loader } from 'excalibur';
import { TiledResource } from '@excaliburjs/plugin-tiled';

const Resources = {
    PixelYe: new ImageSource('images/Pink_Monster/Pink_Monster_Run_6.png'),
    Background: new ImageSource('images/background.png'),
    Dude_Monster_Jump_8: new ImageSource('images/Pink_Monster/Pink_Monster_Jump_8.png'),
    Dude_Monster_Death_8: new ImageSource('images/Pink_Monster/Pink_Monster_Death_8.png'),
    Tilemap: new TiledResource('images/test.tmx'),
    Muziek: new Audio('images/muziek.ogg'),
    GameOverMusic: new Audio('images/gameovermuziek.mp3'),
    Gameover: new ImageSource('images/gameover.png'),
    GameStart: new ImageSource('images/startgame2.png'),
    GameStartSelect: new ImageSource('images/startgameselect2.png'),
    Options: new ImageSource('images/options2.png'),
    OptionsSelect: new ImageSource('images/optionsselect2.png'),
    Home: new ImageSource('images/home2.png'),
    HomeSelect: new ImageSource('images/homeselect2.png'),
    Bus: new ImageSource('images/buszwart.png'),
    Retry: new ImageSource('images/retry.png'),
    RetrySelect: new ImageSource('images/retryselect.png'),
    
};
    


const ResourceLoader = new Loader([
    Resources.PixelYe,
    Resources.Background,
    Resources.Dude_Monster_Jump_8,
    Resources.Dude_Monster_Death_8,
    Resources.Tilemap,
    Resources.Gameover,
    Resources.GameStart,
    Resources.GameStartSelect,
    Resources.Options,
    Resources.OptionsSelect,
    Resources.Home,
    Resources.HomeSelect,
    Resources.Bus,
    Resources.Retry,
    Resources.RetrySelect
    
]);

export { Resources, ResourceLoader };
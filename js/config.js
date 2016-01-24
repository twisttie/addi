/**
 * _____________________________
 *
 * Require.js Configuration File
 * _____________________________
 * 
 * The first javascript file that is loaded. Set up all of the
 * required paths. 
 */

requirejs.config({
    baseUrl: "js/",
    paths: {
        jquery: 'libs/jquery',
        pulse: 'libs/pulse',
        game: 'libs/game',
        phaser: 'libs/phaser',
        tetra: 'libs/tetra',
        bottombar: 'libs/bottombar',
        constants: 'libs/constants'
    }
});
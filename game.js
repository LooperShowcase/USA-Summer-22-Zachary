kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    clearColor:[0,0,1,0.7]
})

loadRoot('./sprites/')
loadSprite('mario','mario.png')
loadSprite('coin','coin.png')
loadSprite('block','block.png')
loadSprite('pipe','pipe_up.png')
loadSprite('surprise','surprise.png')
loadSprite('unboxed','unboxed.png')
loadSprite('mushroom','mushroom.png')
loadSprite('evil_mushroom','evil_mushroom.png')
loadSprite('bigMario','bigMario.png')
loadSprite('goomba', 'evil_mushroom.png')
loadSprite('squatMario', 'squatMario.png')
loadSprite('castle', 'castle.png')
loadSound('gameSound','gameSound.mp3')
loadSound('jumpSound','vine-boom.mp3')
loadSound('tax','tax.wav')
//////////////////////////////////////////////////////////
scene('lose',()=>{
    add([text('You Have Gone On Vacation!',20),pos(width() / 2, height() / 2),origin("center")])
    keyPress('r', ()=>{
        go('game')
    })
})
//////////////////////////////////////////////////////////
scene('win',(score)=>{
    add([text('You Win Da Game!\n score:' + score,20),pos(width() / 2, height() / 2),origin("center")])
    keyPress('r', ()=>{
        go('game')
    })
})
//////////////////////////////////////////////////////////
scene('start',()=>{
    add([text('welcome to your worst nightmare!',20),pos(width() / 2, height() / 2-100),origin("center")])
    const button = add([rect(150,50),pos(width() / 2, height() / 2+100),origin("center")])
    add([text('begin the\ntorment',10),pos(width() / 2, height() / 2+100),origin("center"),color(0,0,0)])
    button.action( ()=>{
        if(button.isHovered()){
        button.color = rgb (0.5,0.5,0.5)
        if(mouseIsClicked){
            go('game')
        }
    }
        else{
            button.color = rgb(1,1,1)
        }
    })
})

    scene("game", () => {
        layers(['bg', 'obj', 'ui'], 'obj')
        const map = [
            '                                                ',
            '                                                ',
            '                                                ',
            '                                                ',
            '                                                ',
            '                                                ',
            '                                                ',
            '                                                ',
            '                                                ',
            '                                                ',
            '                                           *    ',
            '                                                ',
            '                     ?     $                    ',
            '                ^^^^                            ',
            '================================================',
        ]
        const moveSpeed = 120
        const hopForce = 50
        var jumpForce = 300
        let isJumping = false
        let isBig = false

        play("gameSound",{
            volume: 0.4
        })
        const mapSymbols={
            width:20,
            height:20,

            '=':[ sprite('block'),solid()],
            '$':[ sprite('surprise'),solid(),'surprise-coin'],
            '?':[ sprite('surprise'),solid(),'surprise-mushroom'],
            'c':[ sprite('coin'),'coin'],
            'v':[ sprite('unboxed'),solid(),'unboxed'],
            'm':[ sprite('mushroom'),'mushroom', body()],
            '^':[ sprite('goomba'),'goomba', body()],
            '*':[ sprite('castle'),'castle'],

        }

        const gameLevel=addLevel(map,mapSymbols)

        const player = add ([
            sprite('mario'),
            solid(),
            pos(30,0),
            body(),
            origin('bot'),
            big(jumpForce)
        ])

        var marioSize = 1

        let score = 0;
        const scoreLabel = add(
            [
                text("Score: " + score),
                pos(player.pos.x, player.pos.y - 50),
                layer("ui"),
                {
                    value: score
                }
            ]
        )

       
        keyDown('right', ()=>{
            player.move(moveSpeed,0)
            
        })
        keyDown('left', ()=>{
            player.move(-moveSpeed,0)
        })
        keyDown('up', ()=>{
            
            if(player.grounded())
            play("jumpSound"),
            player.jump(jumpForce)
            isJumping = true;
        
            
        })
        keyDown('down', ()=>{
                    player.changeSprite('squatMario')
                
            })
        
        player.on('headbump', (obj)=>{
            if(obj.is("surprise-coin")){
                gameLevel.spawn('c',obj.gridPos.sub(0,1))
                destroy(obj)
                gameLevel.spawn('v',obj.gridPos.sub(0,0))
            }
            if(obj.is("surprise-mushroom")){
                gameLevel.spawn('m',obj.gridPos.sub(0,1))
                destroy(obj)
                gameLevel.spawn('v',obj.gridPos.sub(0,0))
            }
        })
        player.collides('coin', (obj) => {
            destroy(obj)
        })
        player.collides('mushroom', (obj) => {
            destroy(obj)
            player.biggify(10)
            jumpForce = 900
            isBig = true
        })
        
        action('mushroom', (x) =>{
            x.move(20,0)
        })
        action('goomba', (x) =>{
            x.move(-20,0)
        })
        player.collides('goomba', (obj)=>{
            if (isJumping) {
                destroy(obj)
            }
            else {
                
                if(isBig)
                {destroy(obj)
                    player.smallify
                }
                else{destroy(player)
                go('lose')}
            }
        })
        player.action (()=>{
            camPos(player.pos)
            if(player.grounded()){
                isJumping = false;
            }
            else{
                isJumping = true;
            }
            if(player.pos.x > 900){
                go("win", scoreLabel.value)
            }
        })
    

//////////////////////////////////////////////////////
    })
start('start')
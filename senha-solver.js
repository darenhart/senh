

/*

under construction

*/

// remove array item by value
Array.prototype.remove= function(){
    var what, a= arguments, L= a.length, ax;
    while(L && this.length){
        what= a[--L];
        while((ax= this.indexOf(what))!= -1){
            this.splice(ax, 1);
        }
    }
    return this;
}


var temp = 0;

var velocidade = 300;

function run(funcao){
    setTimeout(function(){
        funcao();
    },temp); 
    temp+=velocidade;
}

function goNext()
{
    $('.goNext').click();
}

function getRandomColor()
{
    return aval_colors[getRandomFloor(aval_colors.length)]; 
}

function getRandomFloor(num)
{
    return Math.floor ( Math.random() * num );
}

function setColor(numTentativa, index, color)
{
    $('#tabuleiro').find('.linhaTentativa:eq('+numTentativa+')>div:eq('+index+')').addClass(color)
}

// array com a seguinte estrutura: possib[linha][coluna][cor]
var possib = new Array();
var possib_colors = new Array();

/*
    var tree = new Tree('A');
    var a = tree.getRoot();
  */

function solveLine()
{
    // nao continua se ja acabou o jogo
    if (over)
    {
        return;
    }
    ////////////////////////////
    // cria as possibilidades //
    ////////////////////////////
    var row = numTentativa-1;
    possib[row] = new Array();

    // obtem resultados e as cores da tentativa anterior
    var results = getLineResultColors(row-1);
    var tentativa = getLineTentativaColors(row-1);
    
    // remove as possibilidades descartadas
    for (var i = 0; i<results.length; i++)                
    {
        if (results[i] == 'result-nada')
        {
            // remove a cor das possibilidades
            possib_colors.remove(tentativa[i]);
        }
    }

    // para cada coluna
    for (var col = 0; col<columns; col++)
    {
        possib[row][col] = new Array();
        
        // se a posicao da tentativa anterior estava certa
        if (results[col] == 'result-posicao')
        {
            possib[row][col][0] = tentativa[col];
        }
        else
        {
            // se nao eh a primeira vez
            if (possib[row-1])
            {
                var count = 0;
                //para cada cor das possibilidades passadas
                for (var i = 0; i<possib[row-1][col].length; i++)
                {
                    // se nao eh a mesma cor da ultima tentativa
                    if (tentativa[col] != possib[row-1][col][i])
                    {
                        // se a cor da tentativa anterior esta nas cores possiveis
                        if (possib_colors.indexOf(possib[row-1][col][i]) != -1)
                        {
                            possib[row][col][count] = possib[row-1][col][i];
                            count++;
                        }
                    }
                }
            }
            else
            {
                for (var i = 0; i<possib_colors.length; i++)
                {
                    possib[row][col][i] = possib_colors[i];
                }
            }
        }
    }

    // para cada coluna chuta uma cor dentre as possibilidades
    for (var col = 0; col<possib[row].length; col++)
    {
        var color = possib[row][col][getRandomFloor(possib[row][col].length)];
        setColor(row, col, color);
    }
    goNext(); 

    // ARVORE //
    /*
    var met = 1;

    if (met == 2)
    {
        // mostra arvore
        var pos = '';
        //for (var col = 0; col<possib[row].length; col++)
        for (var color = 0; color<numColors; color++)    
        {
            pos = '';
            //for (var pos = 0; pos<possib[row].length; pos++)
            for (var col = 0; col<columns; col++) 
            {
                pos += "<div class='poss "+possib[row][col][posCor]+"' ></div>";
            }
            var c = tree.addChild(a, pos);
        }
    }
    else
    {
        for (var col = 0; col<possib[row].length; col++)    
        {
            pos = '';
            //for (var posCor = 0; posCor<possib[row][col].length; posCor++)
            for (var i = 0; i<possib[row][col].length; i++)
            {
                pos += "<div class='poss "+possib[row][col][i]+"' ></div>";
            }
            var c = tree.addChild(a, pos);
        }
    }
    
    $("#alvo_arvore").html(tree.showHtml(tree.getRoot()));
    $("#tree").jOrgChart({ chartElement : '#alvo_arvore', dragAndDrop  : false });
    
    // estilo arvore
    var height = 20;
    var width = columns*15;
    $('.poss').css({"width":parseInt((width/columns)/2),"height":height,"float":"left"});
    $('.node').css({'width':width,'height':height,"background-color":"#333", 'border':'solid 1px'});
    */
}


$(document).ready(function() 
{
    $(document).bind("createdGame", function(){
        possib_colors = aval_colors;
        possib = new Array();
    });
    $(document).trigger("createdGame");

    // cria arvore
    var divArvore = $('<div>');
    divArvore.attr('id', 'arvore');
    divArvore.append('<div id="alvo_arvore"></div>');
    divArvore.css('float','left');
    $('#geral').append(divArvore);    

    $("#options").append("<br><br><input type='button' id='solve' value='solve' >");
    $("#solve").click(function(){
        solveLine();
    });
    
    $("#options").append("<input type='button' id='solveAll' value='solve all' >");
    $("#solveAll").click(function(){
        reset();
        temp=0;
        for(var i = 0; i<rows; i++)
        {
            if (over)
            {
                break;
            }
            else
            {    
                run(function(){solveLine();});
            }
        }
    });

});


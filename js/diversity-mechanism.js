class DiversityMechanism {

    static getNormalizedScore( entities, attributes ){
        var avm = new Object();
        var count = entities.length;
        var totals = {};
        totals.score = 0;
        entities.forEach( 
            (o_i) => {
                o_i.score = {};
                o_i.score.normalized = 0;
                attributes.forEach( 
                    (a_i) => {
                        if( !avm.hasOwnProperty(a_i) ){
                            avm[a_i] = {};
                        }
                        if( !avm[a_i].hasOwnProperty(o_i[a_i]) ){
                            avm[a_i][o_i[a_i]] = 0;
                        }
                        avm[a_i][o_i[a_i]]++;
                        var n = Math.log( Number( avm[a_i][o_i[a_i]] ) );
                        var d = Math.log( Number( count ) );
                        var s = 1 - (n / d);
                        o_i.score[a_i] = s;
                        o_i.score.normalized += s;
                    }
                )
                o_i.score.normalized = (o_i.score.normalized / attributes.length);
                totals.score += o_i.score.normalized;
            }
        );
        totals.entities = entities;
        totals.percentage = totals.score / entities.length;
        return totals;
    }
}
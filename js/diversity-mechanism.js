class DiversityMechanism {

    constructor( attributes ) {
        this.attributes = attributes;
    }

    // break a larger group into equal smaller groups
    breakoutGroups( group, count ){
        
        var breakoutGroups = [];
        var numberOfGroups = Math.ceil( group.length / count );
        var totals = [];

        for( var i=0; i<numberOfGroups; i++ ){
            breakoutGroups.push([]);
        }

        group.forEach(
            (g,g_i) => {

                var highestScore = 0;
                var currentCandidateGroupIndex = 0;
                
                breakoutGroups.forEach(
                    (bg,bg_i) => {

                        var newGroup = [...bg];
                        newGroup.push(g);
                        var s = this.getNormalizedScores( newGroup );
                        var userscore = s.entities[s.entities.length - 1].score.normalized;
                        
                        if( 
                            userscore > highestScore 
                            &&  bg.length < count
                        ){

                            highestScore = userscore;
                            currentCandidateGroupIndex = bg_i;
                        }
                    }
                )

                breakoutGroups[currentCandidateGroupIndex].push( g );
            }
        );

        breakoutGroups.forEach(
            (bg,bg_i) => {
                totals.push( this.getNormalizedScores( bg ) )
            }
        );


        return totals;
    }

    // add a certain number from proposed group to base group
    addToGroup( group, candidateGroup, count ){

        var newGroup = [...group];

        for( var i=0; i<count; i++ ){

            var highestScore = 0;
            var currentCandidate = {};
            var currentCandidateIndex = 0;

            candidateGroup.forEach(
                (g,i) => {

                    var potentialGroup = [...group];
                    potentialGroup.push( g );

                    var s = this.getNormalizedScores( potentialGroup );

                    if( s.score > highestScore ){

                        highestScore = s.score;
                        currentCandidate = g;
                        currentCandidateIndex = i;
                    }
                }
            )
            newGroup.push( currentCandidate );
            
            candidateGroup.splice(currentCandidateIndex, 1);
        }

        return this.getNormalizedScores( newGroup );
    }

    // pull a certain number from group 
    getGroup( group, count ){

        var originalGroup = [...group];
        var newGroup = [];

        for( var i=0; i<count; i++ ){

            var highestScore = 0;
            var currentCandidate = {};
            var currentCandidateIndex = 0;

            originalGroup.forEach(
                (g,i) => {

                    var potentialGroup = [...newGroup];
                    potentialGroup.push( g );
                    var s = this.getNormalizedScores( potentialGroup );
                    if( s.score > highestScore ){

                        highestScore = s.score;
                        currentCandidate = g;
                        currentCandidateIndex = i;
                    }
                }
            )

            newGroup.push( currentCandidate );
            
            originalGroup.splice( currentCandidateIndex, 1 );
        }

        return this.getNormalizedScores( newGroup );
    }

    getGroupsNormalizedScores( groups ){
        var totals = {};

        for( var g in groups ){
            totals[g] = {};
            totals[g] = this.getNormalizedScores( groups[g] );
        }

        return totals;
    }

    getNormalizedScores( entities ){
        var avm = new Object();
        var count = entities.length;
        var totals = {};
        totals.score = 0;
        entities.forEach( 
            (o_i) => {
                o_i.score = {};
                o_i.score.normalized = 0;
                this.attributes.forEach( 
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
                        var s;
                        if( count == 1 ){
                            s = 1;
                        }else{
                            s = 1 - (n / d);
                        }
                        
                        o_i.score[a_i] = s;
                        o_i.score.normalized += s;
                    }
                )
                o_i.score.normalized = (o_i.score.normalized / this.attributes.length);
                totals.score += o_i.score.normalized;
            }
        );
        totals.entities = entities;
        totals.percentage = totals.score / entities.length;
        return totals;
    }
}
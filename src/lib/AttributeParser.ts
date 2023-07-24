export interface findBetweenResult {
    startIndex: number;
    endIndex:number;
    inner:string;
    outer:string;
}

export function find_between(input:string, start:string, end:string): findBetweenResult[] {
    const results:findBetweenResult[] = [];
    let part: Partial<findBetweenResult> = {};
    let cur = "";
    let depth = 0;
    for(let i = 0; i < input.length; i ++) {
        if(input.substring(i, i+start.length) === start) {
            cur+=input[i]
            depth++;
            if(depth === 1) {
                part.startIndex = i;
            }
            if(start.length > 1) {
                cur += start.substring(1);
                i+=start.length-1;
            }
        } else if(input.substring(i, i + end.length) === end) {
            cur+=input[i]
            depth--;
            if(depth === 0) {
                part.endIndex = i;
                part.outer = input.substring(part.startIndex, part.endIndex+1);
                part.inner = input.substring(part.startIndex + start.length, part.endIndex - end.length + 1)
                results.push(part as findBetweenResult);
                part = {};
            }
        } else if (depth === 0) {
        } else if (depth > 0) {
            cur+=input[i]
        }
    }    
    return results;
}
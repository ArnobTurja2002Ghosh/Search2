///\/\/\\\/\/\//\\///\//\\\///////\/\/\\\/\/\//\\///\//\\\//////
//
//  Assignment       COMP3200 - Assignment 2
//  Professor:       David Churchill
//  Year / Term:     2023-09
//  File Name:       Search_Student.js
// 
//  Student Name:    Arnob Ghosh
//  Student User:    arnobg
//  Student Email:   arnobg@mun.ca
//  Student ID:      202136073
//  Group Member(s): [enter student name(s)]
//
///\/\/\\\/\/\//\\///\//\\\///////\/\/\\\/\/\//\\///\//\\\//////

// Search_Student.js 
// Computer Science 3200 - Assignment 2
// Author(s): David Churchill [replace with your name(s)]
//    Course: 3200
//
// All of your Assignment code should be in this file, it is the only file submitted.
// You may create additional functions / member variables within this class, but do not
// rename any of the existing variables or function names, since they are used by the
// GUI to perform specific functions.
//
// Recommended order of completing the assignment:
// 0. Do all of this for size 1 ONLY first, before doing size 2 and 3
// 1. Construct the function which computes whether a given size agent canFit in given x,y
//    This will be used by computeSectors / isLegalAction
// 2. Complete the computeSectors algorithm using 4-Dir BFS as shown in class slides
// 3. Use results of step 2 to complete the isConnected function, test it with GUI
// 4. Complete the isLegalAction function, which will be used by searchIteration
// 5. Complete the startSearch function, which is called before searchIteration
// 6. Complete the getOpen and getClosed functions, which will help you visualize / debug
// 7. Complete searchIteration using A* with a heuristic of zero. It should behave like UCS.
// 8. Implement estimateCost heuristic functions, and use it with A*
//
// Please remove these comments before submitting. If you did not get any of the
// functionality of the assignment to work properly, please explain here in a comment.

class Search_Student {

    constructor(grid, config) {
        this.config = config;       // search configuration object
                                    //   config.actions = array of legal [x, y] actions
                                    //   config.actionCosts[i] = cost of config.actions[i]
                                    //   config.heuristic = 'diag', 'card', 'dist', or 'zero'
        this.name = "Student";
        this.grid = grid;           // the grid we are using to search
        this.sx = -1;               // x location of the start state
        this.sy = -1;               // y location of the start state
        this.gx = -1;               // x location of the goal state
        this.gy = -1;               // y location of the goal state
        this.size = 1;              // the square side length (size) of the agent
        this.maxSize = 3;           // the maximum size of an agent

        this.sectors = Array(this.grid.height).fill().map(() => Array(this.grid.width).fill().map(()=> Array(4).fill(0)));

        this.inProgress = false;    // whether the search is in progress
        this.expanded = 0;          // number of nodes expanded (drawn in GUI)

        this.path = [];             // the path, if the search found one
        this.open = [];             // the current open list of the search (stores Nodes)
        this.closed = [];           // the current closed list of the search
        this.cost = 'Search Not Completed'; // the cost of the path found, -1 if no path

        this.computeSectors();
        this.size =2;
        this.computeSectors();
        this.size=3;
        this.computeSectors();
    }

    
    // Student TODO: Implement this function
    //
    // This function should return whether or not an object of a given size can 'fit' at
    // the given (x,y) location. An object can fit if the following are true:
    //    - the object lies entirely within the boundary of the map
    //    - all tiles occupied by the object have the same grid value
    //
    // Args:
    //    x, y (int,int) : (x,y) location of the object
    //    size           : the square side length size of the agent
    //
    // Returns:
    //    bool           : whether the object can fit
    canFit(x, y, size) {
        if(this.grid.isOOB(x, y, size)){
            return false;
        }
        for(let x1=0; x1<size; x1++){
            for(let y1=0; y1<size; y1++){
                if(this.grid.get(x+x1, y+y1) != this.grid.get(x, y)){
                    return false;
                }
            }
        }
        return true;
    }

    // Student TODO: Implement this function
    //
    // This function should compute and store the connected sectors discussed in class.
    // This function is called by the constructor of this object before it is returned.
    //
    // Args:
    //    none
    //
    // Returns:
    //    none
    computeSectors() {
        let sectorNumber = 0;
        for(let x=0; x<this.grid.width; x++){
            for(let y=0; y<this.grid.height; y++){
                if(this.sectors[y][x][this.size]!=0 || !this.canFit(x, y, this.size)) {continue};
                sectorNumber+=1;
                this.CardinalBFS(x, y, sectorNumber);
            }
        }
        console.log(this.size);
        console.log(this.sectors);
    }
    CardinalBFS(x, y, sectorNumber){
        let open = [];
        let closed = [];
        let rootNode = new Node(x, y, null, null);
        open.push(rootNode);

        while(open.length !=0){
            let node = open.shift();
            let inclosed = false;
            for(let i=0; i<closed.length; i++){
                if(node.x == closed[i][0] && node.y == closed[i][1]){
                    inclosed = true;
                }  
            }
            if(!inclosed){
                closed.push([node.x, node.y]);
            
                //open.add(Expand(node, problem)) 
                for(let a=0; a<this.config.actions.length; a++){
                    let action = this.config.actions[a];
                    if(!this.UnoptimisedisLegalAction(node.x, node.y, action)){continue;}
    
                    // generate the nx, ny, next state
                    // generate the new node(nx, ny, action, parent)
                    let childnode = new Node(node.x+action[0], node.y+action[1], action, node);
                    // add that new node to the open list
                    open.push(childnode);
                }
            }
        }
        
        while(closed.length!=0){
            let state = closed.shift();
            this.sectors[state[1]][state[0]][this.size] = sectorNumber;
        }
    }

    UnoptimisedisLegalAction(x, y, action) {

        let nx = x + action[0];
        let ny = y + action[1];

        // 1. create nx, ny (new location after action perform)
        // 2. if this.grid.isOOB(nx,ny) then return false
        // 3. if this.grid.get(x,y) not same as this.grid.get(nx,ny) return false

        if(this.grid.isOOB(nx, ny, 1)){
            //console.log("oob");
            return false; 
        }
        if(this.grid.get(x, y) != this.grid.get(nx, ny)){
            //console.log("color issue");
            return false;
        }
        if(!this.canFit(x, y, this.size) || !this.canFit(nx,ny, this.size)){
            return false;
        }
        return true;
    }

    
    // Student TODO: Implement this function
    //
    // This function should return whether or not the two given locations are connected.
    // Two locations are connected if a path is possible between them. For this assignment,
    // keep in mine that 4D connectedness is equivalent to 8D connectedness because you
    // cannot use a diagonal move to jump over a tile.
    //
    // Args:
    //    x1, y1 (int,int) : (x,y) location 1
    //    x2, y2 (int,int) : (x,y) location 2
    //    size             : the square side length size of the agent
    //
    // Returns:
    //    bool              : whether the two locations are connected
    isConnected(x1, y1, x2, y2, size) {
        // incorrect example code: just return whether the colors match
        // this HAS TO BE CHANGED for the assignment, it is NOT CORRECT
        if(!this.canFit(x1, y1, size) || !this.canFit(x2, y2, size)){
            return false;
        }
        return (this.sectors[y1][x1][size] == this.sectors[y2][x2][size]) && (this.sectors[y1][x1][size] != 0) && (this.sectors[y2][x2][size] != 0);
    }
       
    
    // Student TODO: Implement this function
    //
    // This function should compute and return whether or not the given action is able
    // to be performed from the given (x,y) location.
    //
    // Diagonal moves are only legal if both 2-step cardinal moves are also legal.
    // For example: Moving diagonal up-right is only legal if you can move both up 
    //              then right, as well as right then up. 
    //
    // Args:
    //    x, y   (int,int) : (x,y) location of the given position
    //    size             : the square side length size of the agent
    //    action [int,int] : the action to be performed, representing the [x,y] movement
    //                       from this position. for example: [1,0] is move 1 in the x
    //                       direction and 0 in the y direction (move right). 
    //
    // Returns:
    //    bool : whether or not the given action is legal at the given location
    isLegalAction(x, y, size, action) {
        let nx = x + action[0];
        let ny = y + action[1];

        //same as unoptimised
        //I just thought I could do better
        //console.log(x, y, nx, ny, this.isConnected(x, y, nx, ny));
        return this.isConnected(x, y, nx, y, this.size) && this.isConnected(x, y, x, ny, this.size) && this.isConnected(x, y, nx, ny, this.size);
    }



    // Student TODO: Implement this function
    //
    // This function should set up all the necessary data structures to begin a new search
    // This includes, but is not limited to: setting the start and goal locations, resetting
    // the open and closed lists, and resetting the path. I have provided a starting point,
    // but it is not complete.
    //
    // Please note that this is NOT the place to do your connected sector computations. That
    // should be done ONCE upon object creation in the computeSectors function below.
    //
    // Args:
    //    sx, sy (int,int) : (x,y) position of the start state
    //    gx, gy (int,int) : (x,y) position of the goal state
    //    size   (int)     : the size of the agent for this search episode
    //
    // Returns:
    //    none             : this function does not return anything
    //
    startSearch(sx, sy, gx, gy, size) {
        // deals with an edge-case with the GUI, leave this line here
        if (sx == -1 || gx == -1) { return; }
       
        this.inProgress = true;     // the search is now considered started
        this.sx = sx;               // set the x,y location of the start state
        this.sy = sy;
        this.gx = gx;               // set the x,y location of the goal state
        this.gy = gy;
        this.size = size;           // the size of the agent
        this.path = [];             // set an empty path

        // TODO: everything else necessary to start a new search
        this.closed = [];
        this.open = new BinaryHeap(this.estimateCost1);
        let rootNode = new Node(sx, sy, null, null, 0, null);
        this.open.push(rootNode);
        console.log(rootNode);
    }
       
    // Student TODO: Implement this function
    //
    // This function should compute and return the heuristic function h(n) of a given
    // start location to a given goal location. This function should return one of
    // four different values, based on the this.config.heuristic option
    //
    // Args:
    //    x, y   (int,int) : (x,y) location of the given position
    //    gx, gy (int,int) : (x,y) location of the goal
    //    size             : the square side length size of the agent
    //
    // Returns:
    //    int              : the computed distance heuristic
    estimateCost(x, y, gx, gy) {
        // compute and return the diagonal manhattan distance heuristic
        if(this.config.heuristic=='diag'){
            let excess = Math.abs(Math.abs(gy-y) - Math.abs(gx-x));
            let p = Math.min(Math.abs(gy-y), Math.abs(gx-x));
            return p*141 + excess*100;
        }else if(this.config.heuristic == 'card'){
            return Math.abs(gy-y)*100 + Math.abs(gx-x)*100
        }else if(this.config.heuristic == 'dist'){
            return ((Math.abs(gy-y)*100)**2 + (Math.abs(gx-x)*100)**2)**0.5
        }else if(this.config.heuristic == 'zero'){
            return 0;
        }
    }

    estimateCost1(x){
        return x.g+x.h;
    }

       
    // Student TODO: Implement this function
    //
    // This function performs one iteration of search, which is equivalent to everything
    // inside the while (true) part of the algorithm pseudocode in the class nodes. The
    // only difference being that when a path is found, we set the internal path variable
    // rather than return it from the function. When expanding the current node, you must 
    // use the this.isLegalAction function above.
    //
    // If the search has been completed (path found, or open list empty) then this function
    // should do nothing until the startSearch function has been called again. This function
    // should correctly set the this.inProgress variable to false once the search has been
    // completed, which is required for the GUI to function correctly.
    //
    // This function should perform one the A* search algorithm using Graph-Search
    // The algorithm is located in the Lecture 6 Slides
    //
    // Tip: You can use the included BinaryHeap object as your open list data structure
    //      You may also use a simple array and search for it for the minimum f-value
    //
    // Args:
    //    none
    //
    // Returns:
    //    none
    //
    searchIteration() {
        
        // if we've already finished the search, do nothing
        if (!this.inProgress) { return; }

        // we can do a quick check to see if the start and end goals are connected
        // if they aren't, then we can end the search before it starts
        // don't bother searching if the start and end points don't have the same type
        // this code should remain for your assignment
        if (!this.isConnected(this.sx, this.sy, this.gx, this.gy, this.size)) { 
            this.inProgress = false; // we don't need to search any more
            this.cost = -1; // no path was possible, so the cost is -1
            return; 
        }

        if (!this.inProgress) { return; }
   
        if(this.open.size() ==0){
            //console.log("MT");
            this.inProgress = false;
            this.cost = -1;
            return;
        }
        let node = this.open.pop();
        //console.log(node);
        
        if(node.x == this.gx && node.y == this.gy){
            let nextNode = node;
            while(nextNode.parent != null){
                this.path.push(nextNode.action);
                nextNode = nextNode.parent;
            }
            // reverse this path
            this.path.reverse();
            this.inProgress = false;
            this.cost = node.g;
            console.log(this.closed);
            return;
        }
        for(let i=0; i<this.closed.length; i++){
            if(node.x == this.closed[i][0] && node.y == this.closed[i][1]){
                return;
            }    
        }

        this.closed.push([node.x, node.y]);
            
        //open.add(Expand(node, problem)) 
        loop1: for(let a=0; a<this.config.actions.length; a++){
            let action = this.config.actions[a];
            console.log("action", action);
            if(!this.isLegalAction(node.x, node.y, this.size, action)){continue;}

            // generate the nx, ny, next state
            // generate the new node(nx, ny, action, parent)
            let newG = node.g + this.config.actionCosts[a];
            let heuristic = this.estimateCost(node.x+action[0], node.y+action[1], this.gx, this.gy);
            let childnode = new Node(node.x+action[0], node.y+action[1], node, action, newG, heuristic);
            // add that new node to the open list
            for(let i=0; i<this.closed.length; i++){
                if(childnode.x == this.closed[i][0] && childnode.y == this.closed[i][1]){
                    continue loop1;
                }    
            }
            this.open.push(childnode);
            console.log("child pushed", childnode, childnode.h);
            
        }
        // if the search ended and no path was found, set this.cost = -1
    }

    // Student TODO: Implement this function
    //
    // This function returns the current open list states in a given format. This exists as
    // a separate function because your open list used in search will store nodes
    // instead of states, and may have a custom data structure that is not an array.
    //
    // Args:
    //    none
    //
    // Returns:
    //    openList : an array of unique [x, y] states that are currently on the open list
    //
    getOpen() {
        let openStates = [];
        for(let a=0; a<this.open.size(); a++){
            openStates.push([this.open.content[a].x, this.open.content[a].y]);
        }
        return openStates;
    }

    // Student TODO: Implement this function
    //
    // This function returns the current closed list in a given format. This exists as
    // a separate function, since your closed list used in search may have a custom 
    // data structure that is not an array.
    //
    // Args:
    //    none
    //
    // Returns:
    //    closedList : an array of unique [x, y] states that are currently on the closed list
    //
    getClosed() {
        return this.closed;
    }
}

// The Node class to be used in your search algorithm.
// This should not need to be modified to complete the assignment
// Note: child.g = parent.g + cost(action)
class Node {
    constructor(x, y, parent, action, g, h) {
        this.x = x;
        this.y = y;
        this.action = action;
        this.parent = parent;
        this.g = g;
        this.h = h;
    }
}

// Copyright (C) David Churchill - All Rights Reserved
// COMP3200 - 2023-09 - Assignment 2
// Written by David Churchill (dave.churchill@gmail.com)
// Unauthorized copying of these files are strictly prohibited
// Distributed only for course work at Memorial University
// If you see this file online please contact email above

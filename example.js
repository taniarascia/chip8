/*******************************************************************************************
 *
 *   raylib [shapes] example - Draw basic shapes 2d (rectangle, circle, line...)
 *
 *   This example has been created using raylib 1.0 (www.raylib.com)
 *   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
 *
 *   Copyright (c) 2014 Ramon Santamaria (@raysan5)
 *
 ********************************************************************************************/

const r = require('raylib')

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800
const screenHeight = 450

r.InitWindow(screenWidth, screenHeight, 'raylib [shapes] example - basic shapes drawing')

r.SetTargetFPS(60)
//--------------------------------------------------------------------------------------

// Main game loop
while (!r.WindowShouldClose()) {
  // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  // TODO: Update your variables here
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  r.BeginDrawing()

  r.ClearBackground(r.RAYWHITE)

  r.DrawText('some basic shapes available on raylib', 20, 20, 20, r.DARKGRAY)

  var position = {
    x: 100,
    y: 100,
  }
  var size = {
    x: 200,
    y: 150,
  }
  r.DrawRectangleV(position, size, r.DARKBLUE)

  r.DrawRectangleRec(
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    },
    r.PINK
  )

  /*
        DrawCircle(screenWidth/4, 120, 35, DARKBLUE);
        DrawRectangle(screenWidth/4*2 - 60, 100, 120, 60, RED);
        DrawRectangleLines(screenWidth/4*2 - 40, 320, 80, 60, ORANGE);  // NOTE: Uses QUADS internally, not lines
        DrawRectangleGradientH(screenWidth/4*2 - 90, 170, 180, 130, MAROON, GOLD);
        DrawTriangle((Vector2){screenWidth/4*3, 80},
                     (Vector2){screenWidth/4*3 - 60, 150},
                     (Vector2){screenWidth/4*3 + 60, 150}, VIOLET);
        DrawPoly((Vector2){screenWidth/4*3, 320}, 6, 80, 0, BROWN);
        DrawCircleGradient(screenWidth/4, 220, 60, GREEN, SKYBLUE);
        // NOTE: We draw all LINES based shapes together to optimize internal drawing,
        // this way, all LINES are rendered in a single draw pass
        DrawLine(18, 42, screenWidth - 18, 42, BLACK);
        DrawCircleLines(screenWidth/4, 340, 80, DARKBLUE);
        DrawTriangleLines((Vector2){screenWidth/4*3, 160},
                          (Vector2){screenWidth/4*3 - 20, 230},
                          (Vector2){screenWidth/4*3 + 20, 230}, DARKBLUE);
        */
  r.EndDrawing()
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
r.CloseWindow() // Close window and OpenGL context
//--------------------------------------------------------------------------------------

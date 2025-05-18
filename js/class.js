class Button {
    constructor(x, y, w, h, label, bgColor, textColor, id) {
        // Position and size
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        // Appearance
        this.label = label;
        this.bgColor = bgColor || color(200); // Default gray if not provided
        this.textColor = textColor || color(0); // Default black if not provided
        this.hoverColor = color(red(this.bgColor) - 30, green(this.bgColor) - 30, blue(this.bgColor) - 30);
        this.currentColor = this.bgColor;

        // State
        this.isHovered = false;
        this.isPressed = false;

        // Button Id
        this.id = id;
    }

    // Display the button
    display() {
        // Update hover state
        this.isHovered = this.contains(mouseX, mouseY);

        // Change color if hovered
        this.currentColor = this.isHovered ? this.hoverColor : this.bgColor;

        // Draw button background
        fill(this.currentColor);
        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height, 5); // Rounded corners

        // Draw button text
        fill(this.textColor);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(this.label, this.x, this.y);
    }

    // Check if point is inside button
    contains(px, py) {
        return (
            px >= this.x - this.width / 2 &&
            px <= this.x + this.width / 2 &&
            py >= this.y - this.height / 2 &&
            py <= this.y + this.height / 2
        );
    }

    // Check if button is clicked (call in mousePressed())
    clicked() {
        if (this.contains(mouseX, mouseY)) {
            this.isPressed = true;
            return true;
        }
        return false;
    }

    // Reset pressed state (call in mouseReleased())
    released() {
        this.isPressed = false;
    }
}

class ImageButton {
    constructor(x, y, w, h, img, id) {
        // Position and size
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        
        // Image properties
        this.img = img;
        this.id = id;
        
        // State
        this.isHovered = false;
        this.isPressed = false;
        this.scale = 1.0;
        this.estado = true;
    }

    // Display the image button
    display() {
        // Update hover state and scale
        this.isHovered = this.contains(mouseX, mouseY);
        this.scale = this.isHovered ? 1.05 : 1.0;
        
        // Draw image with optional hover effect
        imageMode(CENTER);
        image(
            this.img,
            this.x,
            this.y,
            this.width * this.scale,
            this.height * this.scale
        );
    }

    // Check if point is inside button
    contains(px, py) {
        return (
            px >= this.x - this.width / 2 &&
            px <= this.x + this.width / 2 &&
            py >= this.y - this.height / 2 &&
            py <= this.y + this.height / 2
        );
    }

    // Check if button is clicked
    clicked() {
        if (this.contains(mouseX, mouseY)) {
            this.isPressed = true;
            return true;
        }
        return false;
    }

    // Reset pressed state
    released() {
        this.isPressed = false;
    }
}
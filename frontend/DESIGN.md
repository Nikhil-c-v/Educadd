---
name: EduCADD Professional
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#42474f'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#727780'
  outline-variant: '#c2c7d0'
  surface-tint: '#316193'
  primary: '#002a4d'
  on-primary: '#ffffff'
  primary-container: '#004071'
  on-primary-container: '#80ade4'
  inverse-primary: '#a0c9ff'
  secondary: '#bc0004'
  on-secondary: '#ffffff'
  secondary-container: '#e1271c'
  on-secondary-container: '#fffbff'
  tertiary: '#272929'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d3f3f'
  on-tertiary-container: '#a9aaaa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a0c9ff'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#11497a'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4a9'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930002'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.25'
  headline-md:
    fontFamily: manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: workSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: workSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: workSans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: workSans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-padding: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered to project an image of academic excellence and technical proficiency. It caters to a dual audience: ambitious students seeking high-growth careers and corporate partners looking for reliable talent. The aesthetic aligns with **Corporate / Modern** principles, prioritizing clarity, structured hierarchy, and functional elegance.

The visual language is rooted in "Professional Trust." It avoids fleeting trends in favor of a timeless, stable layout that mirrors the rigor of engineering and design disciplines. By utilizing a strong geometric foundation and a purposeful use of the brand’s high-contrast color palette, the system ensures that information is digestible while maintaining an authoritative presence.

## Colors

The color palette is anchored by "Academic Deep Blue," which serves as the primary driver for navigation, headers, and key backgrounds to establish a sense of history and reliability. "Signal Red" is used sparingly but aggressively as an accent color for CTAs, urgent notifications, and decorative brand flourishes.

- **Primary (#004071):** Used for structural elements, hero sections, and primary buttons.
- **Secondary (#EE3124):** Reserved for high-impact accents, hover states, and call-to-action buttons.
- **Tertiary (#F2F2F2):** Utilized for section backgrounds to break up content and reduce eye fatigue.
- **Neutral (#000000 / #FFFFFF):** Black is used for primary body text for maximum readability, while pure white is the canvas for all card elements and content containers.

## Typography

This design system uses a two-font pairing to balance character with utility. **Manrope** is selected for headlines; its modern, geometric construction provides a progressive feel that suits technical education. **Work Sans** is used for body text and labels, chosen for its exceptional legibility and neutral tone which ensures that complex course descriptions remain accessible.

Hierarchy should be strictly enforced. Headlines use tighter letter spacing and heavier weights to create a strong visual anchor. Body copy maintains a generous line height (1.6) to facilitate long-form reading on course pages.

## Layout & Spacing

The system employs a **Fixed Grid** model for desktop viewing to maintain a controlled, professional presentation, transitioning to a fluid model for mobile devices. 

A 12-column grid is the standard for content organization. 
- **Course Grids:** Typically span 4 columns each (3-up layout).
- **Hero Content:** Spans 8 columns to allow for prominent imagery or lead-capture forms.
- **Vertical Rhythm:** Spacing follows a base-8 scale. Section headers are separated from content by 32px (stack-lg), while internal card elements use 16px (stack-md) to maintain tight grouping.

## Elevation & Depth

Visual hierarchy is achieved through a combination of **Tonal Layers** and **Ambient Shadows**. 

The design avoids heavy gradients, favoring flat surfaces that appear to "lift" off the page. 
- **Level 1 (Cards/Inputs):** A subtle, highly diffused shadow (0px 4px 12px, 5% opacity) to provide separation from the #F2F2F2 background.
- **Level 2 (Hover States/Modals):** A more pronounced shadow (0px 12px 24px, 10% opacity) to indicate interactivity or focus.
- **Flat Depth:** Dark backgrounds (Primary Blue) should use no shadows; instead, use white text and high-contrast borders for elements contained within them.

## Shapes

The shape language is defined by "The Softened Corner." A standard radius of 8px (0.5rem) is applied to most UI components to strike a balance between friendly modernism and technical precision.

- **Buttons & Inputs:** Use the standard 0.5rem radius.
- **Feature Cards:** Use the `rounded-lg` (1rem) radius to feel more approachable and distinct from the main container.
- **Decorative Elements:** Small accents like "New" badges or category tags may use a pill-shape (full radius) to differentiate them from functional inputs.

## Components

### Buttons
Primary buttons use the Deep Blue background with White text. On hover, they transition to the Secondary Red. Secondary buttons use a Red outline with Red text, filling with Red on hover. All buttons should have a minimum height of 48px for touch accessibility.

### Cards
Cards are the primary container for course listings and testimonials. They must feature a white background, the Level 1 shadow, and a 1px #E0E0E0 border to maintain definition against light gray backgrounds.

### Input Fields
Forms are critical for lead generation. Fields should have a 1px border (#CCCCCC) that thickens and changes to Primary Blue on focus. Labels should be positioned above the field using the `label-lg` typography style.

### Chips & Badges
Use for "Course Duration" or "Placement Guaranteed" indicators. These should use a light tint of the Primary Blue (10% opacity) with the full-strength Primary Blue text for a sophisticated, low-contrast look.

### Lists & Features
Educational features should be presented with custom checkmark icons in Secondary Red to draw the eye to the benefits of the curriculum.
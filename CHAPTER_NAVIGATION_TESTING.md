# Chapter Navigation - Testing Guide

## Prerequisites
- Backend API running on `http://localhost:3001`
- Frontend running on `http://localhost:5173` (or configured port)
- Books with multiple chapters in the database

## 🧪 Test Scenarios

### Scenario 1: Navigate Between Chapters (Basic Flow)
**Steps:**
1. Open a book with chapters: `/reading/book-id`
2. Observe first chapter loads
3. Click "Next" button
4. Verify:
   - ✅ Chapter content changes
   - ✅ Chapter title/number updates
   - ✅ Page scrolls to top automatically
   - ✅ URL updates
   - ✅ Progress bar updates
   - ✅ Chapter counter updates (e.g., "2 of 28")
   - ✅ Previous button becomes enabled

**Expected Result:** Navigation works smoothly with all UI elements updating

---

### Scenario 2: Disabled Button States
**Steps:**
1. Load first chapter of a multi-chapter book
2. Observe Previous button
3. Go to last chapter
4. Observe Next button

**Expected Result:**
- ✅ First chapter: Previous button is grayed out and disabled
- ✅ Last chapter: Next button is grayed out and disabled
- ✅ Disabled buttons show message on hover: "No [next/previous] chapter available"
- ✅ Can't click disabled buttons (cursor shows "not-allowed")

**Edge Case:** Single chapter book
- ✅ Both buttons should be disabled
- ✅ Chapter counter shows "1 of 1"

---

### Scenario 3: Button Hover Tooltips
**Steps:**
1. Load a chapter in the middle
2. Hover over "Previous" button
3. Observe tooltip
4. Hover over "Next" button
5. Observe tooltip

**Expected Result:**
- ✅ Previous button tooltip: "Previous: [Chapter Title]"
- ✅ Next button tooltip: "Next: [Chapter Title]"
- ✅ Chapter numbers in tooltips are correct

---

### Scenario 4: Chapter Dropdown Navigation
**Steps:**
1. Click "Jump to chapter" at bottom of footer
2. Observe chapter list opens with numbered buttons
3. Click on a non-current chapter
4. Verify:
   - ✅ Content changes to selected chapter
   - ✅ Page scrolls to top
   - ✅ Current chapter button highlights in orange (#B4690E)
   - ✅ Dropdown closes after selection

**Expected Result:** Quick chapter selection works seamlessly

---

### Scenario 5: Auto-Scroll to Top
**Steps:**
1. Load a chapter
2. Scroll down significantly in the content
3. Click "Next" button
4. Observe scroll position

**Expected Result:**
- ✅ Content automatically scrolls to top when chapter changes
- ✅ No manual scrolling needed
- ✅ Works with all navigation methods

---

### Scenario 6: URL/State Updates
**Steps:**
1. Open: `/reading/book-id`
2. Click Next 3 times
3. Note the URL
4. Copy URL and open in new tab
5. Observe what loads

**Expected Result:**
- ✅ URL shows correct chapter parameter
- ✅ New tab loads the same chapter
- ✅ Deep linking works correctly

**With chapter ID:**
1. Open: `/reading/book-id?chapterId=chapter-uuid`
2. Verify: Correct chapter loads with that ID
3. Back button works to previous chapter
4. History navigation works correctly

---

### Scenario 7: Progress Indicators
**Steps:**
1. Load chapter 5 of 20
2. Observe:
   - Header progress bar
   - Footer progress bar
   - Chapter counter
   - Progress percentage

**Expected Result:**
- ✅ Both progress bars fill to 25% (5/20)
- ✅ Counter shows "5 of 20"
- ✅ Progress updates correctly when navigating

---

### Scenario 8: Reading Time & Word Count
**Steps:**
1. Load a chapter
2. Look at the chapter header

**Expected Result:**
- ✅ Word count displays (if available from API)
- ✅ Reading time estimate shows (e.g., "~12 min read")
- ✅ Both update correctly when changing chapters

---

### Scenario 9: Loading States
**Steps:**
1. Open book with chapters
2. Click Next button multiple times rapidly
3. Observe loading behavior

**Expected Result:**
- ✅ Loading spinner appears during fetch
- ✅ Navigation buttons remain disabled while loading
- ✅ Content updates after loading completes
- ✅ No race conditions with rapid clicks

---

### Scenario 10: Error Handling
**Test 10.1 - Invalid Book ID**
1. Open: `/reading/invalid-book-id`
2. Observe error message

**Expected Result:**
- ✅ Error message displays
- ✅ Back to Home link appears
- ✅ Reader doesn't crash

**Test 10.2 - Invalid Chapter ID**
1. Open: `/reading/valid-book-id?chapterId=invalid-chapter-id`
2. Observe behavior

**Expected Result:**
- ✅ Error message displays
- ✅ Option to go back
- ✅ Graceful error handling

**Test 10.3 - Network Error**
1. Stop backend API
2. Try to navigate between chapters
3. Observe error

**Expected Result:**
- ✅ Error message displays
- ✅ No crash or blank page
- ✅ User can retry or navigate back

---

### Scenario 11: Responsive Design
**Mobile (320px - 640px):**
1. Open reader on mobile device
2. Navigate between chapters
3. Verify:
   - ✅ Buttons fit on screen
   - ✅ Text is readable
   - ✅ Scrolling works smoothly
   - ✅ No horizontal scroll needed

**Tablet (641px - 1024px):**
1. Open reader on tablet
2. Verify all features work

**Desktop (1025px+):**
1. Open reader on desktop
2. Verify full UI visible
3. Settings button visible

---

### Scenario 12: First and Last Chapter Edge Cases
**First Chapter:**
1. Load first chapter
2. Verify:
   - ✅ Previous button disabled
   - ✅ Next button enabled (if more chapters exist)
   - ✅ Progress shows "1 of X"

**Last Chapter:**
1. Navigate to last chapter
2. Verify:
   - ✅ Next button disabled
   - ✅ Previous button enabled
   - ✅ Progress shows "X of X" (100%)
   - ✅ Chapter dropdown shows last chapter selected

---

### Scenario 13: Chapter List Dropdown
**Steps:**
1. Click "Jump to chapter" dropdown
2. For a 28-chapter book, verify:
   - ✅ All 28 chapter buttons visible/scrollable
   - ✅ Current chapter highlighted in orange
   - ✅ Non-current chapters have gray background
   - ✅ Hover effect works on chapter buttons
   - ✅ Clicking chapter loads it immediately

---

### Scenario 14: Browser Navigation
**Steps:**
1. Navigate: Chapter 1 → 2 → 3 → 4
2. Click browser Back button
3. Verify back to Chapter 3
4. Click browser Back again
5. Verify back to Chapter 2
6. Click browser Forward
7. Verify forward to Chapter 3

**Expected Result:**
- ✅ Browser history works correctly
- ✅ URL updates with back/forward
- ✅ Content loads correctly

---

### Scenario 15: Multiple Books
**Steps:**
1. Read Book A, Chapter 5
2. Navigate to Book B (from home)
3. Start reading Book B

**Expected Result:**
- ✅ Book B loads from Chapter 1
- ✅ Chapter list updates for Book B
- ✅ Navigation works correctly for Book B
- ✅ No conflicts or state bleeding

---

## 📊 Performance Tests

### Load Time Test
1. Open reader with a book
2. Measure time to first chapter display
3. Click Next 10 times
4. Measure each navigation time

**Target:** Each navigation < 200ms after caching kicks in

### Memory Test
1. Open reader
2. Navigate through 20+ chapters
3. Check browser memory usage
4. Should remain stable (no memory leaks)

---

## 🔍 Accessibility Tests

- [ ] Tab through buttons - correct order
- [ ] Enter/Space activates buttons - works
- [ ] Screen reader announces chapter info - works
- [ ] Focus visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Tooltips announce disabled state

---

## 📱 Device Testing

Test on real devices:
- [ ] iPhone 12 (375px width)
- [ ] iPad (1024px width)
- [ ] Desktop 1920px
- [ ] Chrome, Firefox, Safari, Edge

---

## 🚨 Known Limitations

None currently. All features implemented.

---

## ✅ Final Verification Checklist

- [ ] All 15 scenarios pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Responsive on all devices
- [ ] Network errors handled
- [ ] Performance acceptable
- [ ] Accessibility features work
- [ ] UI looks polished
- [ ] Tooltips helpful
- [ ] Error messages clear
- [ ] Loading states visible
- [ ] Disabled states clear
- [ ] Progress indicators accurate
- [ ] Browser history works
- [ ] Deep linking works

---

## 🐛 Bug Reporting Format

If you find issues:

```
**Issue:** [Brief title]
**Scenario:** [Which test scenario]
**Steps to reproduce:**
1. ...
2. ...

**Expected:** [What should happen]
**Actual:** [What happens instead]

**Screenshots/Video:** [If applicable]
**Device:** [Device/Browser info]
```

---

End of Testing Guide

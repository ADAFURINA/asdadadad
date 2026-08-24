const STORAGE_KEY = 'course-checklist-state';
const totalCourses = document.querySelectorAll('.course input[type="checkbox"]').length;
const totalCredits = Array.from(document.querySelectorAll('.course input[type="checkbox"]')).reduce(
  (sum, checkbox) => sum + Number(checkbox.dataset.credits || 0),
  0
);

const progressBar = document.getElementById('progress');
const percentageText = document.getElementById('percentage');
const completedCountText = document.getElementById('completed-count');
const creditCountText = document.getElementById('credit-count');
const checkboxes = document.querySelectorAll('.course input[type="checkbox"]');

function saveState() {
  const checkedIds = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.dataset.id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const savedSet = new Set(saved);

    checkboxes.forEach((checkbox) => {
      checkbox.checked = savedSet.has(checkbox.dataset.id);
    });
  } catch (error) {
    console.warn('Could not load checklist state', error);
  }
}

function updateProgress() {
  const checkedCount = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;
  const checkedCredits = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .reduce((sum, checkbox) => sum + Number(checkbox.dataset.credits || 0), 0);

  const percent = Math.round((checkedCount / totalCourses) * 100);

  progressBar.style.width = `${percent}%`;
  percentageText.textContent = `${percent}%`;
  completedCountText.textContent = `${checkedCount}/${totalCourses} completed`;
  creditCountText.textContent = `${checkedCredits}/${totalCredits} credits`;
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    saveState();
    updateProgress();
  });
});

loadState();
updateProgress();

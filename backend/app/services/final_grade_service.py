from typing import List


class FinalGradeService:

    @staticmethod
    def calculate_final_grade(
        original_criteria: List[dict],
        criterion_id: str,
        final_criterion_score: float
    ):

        updated_criteria = []

        for criterion in original_criteria:

            updated_criterion = criterion.copy()

            if criterion["id"] == criterion_id:

                max_score = float(
                    criterion["max_score"]
                )

                score = float(
                    final_criterion_score
                )

                # Never allow an invalid score
                score = max(0, min(score, max_score))

                updated_criterion["score"] = score

            updated_criteria.append(
                updated_criterion
            )

        total_score = sum(
            float(criterion["score"])
            for criterion in updated_criteria
        )

        max_score = sum(
            float(criterion["max_score"])
            for criterion in updated_criteria
        )

        return {
            "total_score": total_score,
            "max_score": max_score,
            "criteria": updated_criteria
        }
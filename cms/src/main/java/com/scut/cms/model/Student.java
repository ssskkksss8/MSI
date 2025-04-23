package com.scut.cms.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @Column(length = 10)
    @Size(min = 10, max = 10, message = "Id must contain exacly 10 characters")
    private String id;

    @NotBlank(message="Name cannot be empty")
    private String name;

    @Pattern(regexp = "male|female", message = "Gender must be 'male' or 'female'")
    private String sex; 

    @Min(value = 10, message = "Minimum age — 10")
    @Max(value = 50, message = "Maximum age — 50")
    @Column(name = "entrance_age")
    private int entranceAge; 

    @Min(value = 1900, message = "The year of admission must be after 1900.")
    @Column(name = "entrance_year")
    private int entranceYear;

    private String studentClass;
}
